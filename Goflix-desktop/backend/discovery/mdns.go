package discovery

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/hashicorp/mdns"
)

const (
	ServiceName     = "_goflix._tcp"
	domain          = "local."
	refreshInterval = 60 * time.Second
	serviceInfo     = "Goflix P2P Media Server"
)

// Peer represents a discovered network peer
type Peer struct {
	Name     string            `json:"name"`
	Host     string            `json:"host"`
	Port     int               `json:"port"`
	AddrIPv4 string            `json:"addrIPv4,omitempty"`
	LastSeen time.Time         `json:"lastSeen"`
	Metadata map[string]string `json:"metadata,omitempty"`
	IsActive bool              `json:"isActive"`
}

// Service manages peer discovery and tracking
type Service struct {
	name         string
	port         int
	server       *mdns.Server
	peers        map[string]Peer
	peersLock    sync.RWMutex
	ctx          context.Context
	cancel       context.CancelFunc
	healthTicker *time.Ticker
	onPeerUpdate func(Peer) // Callback for peer updates
}

// NewService creates a new mDNS service instance
func NewService(name string, port int) *Service {
	ctx, cancel := context.WithCancel(context.Background())
	return &Service{
		name:   name,
		port:   port,
		peers:  make(map[string]Peer),
		ctx:    ctx,
		cancel: cancel,
	}
}

// Start initializes and starts the mDNS service
func (s *Service) Start() error {
	hostname, err := os.Hostname()
	if err != nil {
		return fmt.Errorf("failed to get hostname: %w", err)
	}

	// Service metadata
	metadata := map[string]string{
		"version": "1.0",
		"name":    s.name,
	}
	metadataStr, _ := json.Marshal(metadata)

	// Create mDNS service
	service, err := mdns.NewMDNSService(
		hostname,
		ServiceName,
		domain,
		"",
		s.port,
		nil,
		[]string{
			serviceInfo,
			string(metadataStr),
		},
	)
	if err != nil {
		return fmt.Errorf("failed to create mDNS service: %w", err)
	}

	// Start server
	server, err := mdns.NewServer(&mdns.Config{Zone: service})
	if err != nil {
		return fmt.Errorf("failed to start mDNS server: %w", err)
	}
	s.server = server

	// Start discovery and health check routines
	go s.discoverPeers()
	go s.healthCheck()

	log.Printf("mDNS service started on port %d", s.port)
	return nil
}

// discoverPeers continuously discovers network peers
func (s *Service) discoverPeers() {
	entriesCh := make(chan *mdns.ServiceEntry, 10)
	ticker := time.NewTicker(refreshInterval)
	defer ticker.Stop()

	// Process discovered entries
	go func() {
		for {
			select {
			case entry := <-entriesCh:
				s.processPeerEntry(entry)
			case <-s.ctx.Done():
				return
			}
		}
	}()

	// Regular peer discovery
	for {
		select {
		case <-ticker.C:
			params := mdns.DefaultParams(ServiceName)
			params.Entries = entriesCh
			params.WantUnicastResponse = true

			if err := mdns.Query(params); err != nil {
				log.Printf("Error discovering peers: %v", err)
			}
		case <-s.ctx.Done():
			return
		}
	}
}

func (s *Service) processPeerEntry(entry *mdns.ServiceEntry) {
	if !isPeerValid(entry) {
		return
	}

	infoStrings := make([]string, len(entry.Info))
	for i, info := range entry.Info {
		infoStrings[i] = string(info)
	}

	metadata := extractMetadata(infoStrings)

	peer := Peer{
		Name:     entry.Host,
		Host:     entry.Host,
		Port:     entry.Port,
		AddrIPv4: formatIPv4(entry.AddrV4),
		LastSeen: time.Now(),
		Metadata: metadata,
		IsActive: true,
	}

	s.peersLock.Lock()
	s.peers[entry.Host] = peer
	s.peersLock.Unlock()

	log.Printf("Discovered peer: %s at %s:%d", entry.Host, peer.AddrIPv4, entry.Port)

	if s.onPeerUpdate != nil {
		s.onPeerUpdate(peer)
	}
}

// healthCheck monitors peer health and removes stale peers
func (s *Service) healthCheck() {
	ticker := time.NewTicker(refreshInterval / 2)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.peersLock.Lock()
			now := time.Now()

			for host, peer := range s.peers {
				if now.Sub(peer.LastSeen) > refreshInterval*2 {
					peer.IsActive = false
					s.peers[host] = peer

					if s.onPeerUpdate != nil {
						s.onPeerUpdate(peer)
					}
				}
			}
			s.peersLock.Unlock()
		case <-s.ctx.Done():
			return
		}
	}
}

// HTTP Handlers

func (s *Service) PeersHandler(w http.ResponseWriter, r *http.Request) {
	s.peersLock.RLock()
	defer s.peersLock.RUnlock()

	peerList := make([]Peer, 0, len(s.peers))
	for _, peer := range s.peers {
		if peer.IsActive {
			peerList = append(peerList, peer)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(peerList)
	if err != nil {
		return
	}
}

// Utility functions

func formatIPv4(ip net.IP) string {
	if ip == nil {
		return ""
	}
	return fmt.Sprintf("%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3])
}

func isPeerValid(entry *mdns.ServiceEntry) bool {
	return entry != nil && len(entry.Info) > 0 && serviceInfo == string(entry.Info[0])
}
func extractMetadata(info []string) map[string]string {
	if len(info) < 2 {
		return nil
	}

	var metadata map[string]string
	if err := json.Unmarshal([]byte(info[1]), &metadata); err != nil {
		return nil
	}
	return metadata
}

// Stop gracefully shuts down the service
func (s *Service) Stop() {
	s.cancel()
	if s.server != nil {
		s.server.Shutdown()
	}
	if s.healthTicker != nil {
		s.healthTicker.Stop()
	}
}

// SetPeerUpdateCallback sets a callback for peer updates
func (s *Service) SetPeerUpdateCallback(callback func(Peer)) {
	s.onPeerUpdate = callback
}

// GetPeers returns all active peers
func (s *Service) GetPeers() []Peer {
	s.peersLock.RLock()
	defer s.peersLock.RUnlock()

	peers := make([]Peer, 0, len(s.peers))
	for _, peer := range s.peers {
		if peer.IsActive {
			peers = append(peers, peer)
		}
	}
	return peers
}

func (s *Service) GetHostname() any {
	host_name, err := os.Hostname()
	if err != nil {
		return nil
	}
	return host_name

}
