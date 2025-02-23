package chats

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// ChatServer represents the chat server instance
type ChatServer struct {
	chatRooms map[string]map[*Client]bool
	broadcast chan Message
	mu        sync.RWMutex
	upgrader  websocket.Upgrader
	ctx       context.Context
	cancel    context.CancelFunc
}

// Client represents a WebSocket client connection
type Client struct {
	conn   *websocket.Conn
	send   chan []byte
	host   string
	ctx    context.Context
	cancel context.CancelFunc
}

// Message represents a chat message
type Message struct {
	Host    string `json:"host"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
	Time    string `json:"time,omitempty"`
}

// NewChatServer creates a new chat server instance
func NewChatServer() *ChatServer {
	ctx, cancel := context.WithCancel(context.Background())
	return &ChatServer{
		chatRooms: make(map[string]map[*Client]bool),
		broadcast: make(chan Message, 256), // Buffered channel
		upgrader: websocket.Upgrader{
			CheckOrigin:     func(r *http.Request) bool { return true },
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
		ctx:    ctx,
		cancel: cancel,
	}
}

// Start initializes the chat server
func (s *ChatServer) Start() {
	go s.handleMessages()
}

// Stop gracefully shuts down the chat server
func (s *ChatServer) Stop() {
	s.cancel()
	s.mu.Lock()
	defer s.mu.Unlock()

	// Close all client connections
	for _, clients := range s.chatRooms {
		for client := range clients {
			client.cancel()
			client.conn.Close()
		}
	}
}

// HandleWebSocket handles WebSocket connections for a specific host
func (s *ChatServer) HandleWebSocket(w http.ResponseWriter, r *http.Request, host string) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Error upgrading connection: %v\n", err)
		return
	}

	clientCtx, clientCancel := context.WithCancel(s.ctx)
	client := &Client{
		conn:   conn,
		send:   make(chan []byte, 256),
		host:   host,
		ctx:    clientCtx,
		cancel: clientCancel,
	}

	// Register client
	s.mu.Lock()
	if s.chatRooms[host] == nil {
		s.chatRooms[host] = make(map[*Client]bool)
	}
	s.chatRooms[host][client] = true
	s.mu.Unlock()

	// Start client routines
	go s.readPump(client)
	go s.writePump(client)
}

// readPump handles incoming messages from a client
func (s *ChatServer) readPump(client *Client) {
	defer func() {
		s.unregisterClient(client)
		client.conn.Close()
	}()

	client.conn.SetReadLimit(512) // Limit message size
	client.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	client.conn.SetPongHandler(func(string) error {
		client.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		select {
		case <-client.ctx.Done():
			return
		default:
			_, message, err := client.conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					fmt.Printf("Error reading message: %v\n", err)
				}
				return
			}

			var msg Message
			if err := json.Unmarshal(message, &msg); err != nil {
				fmt.Printf("Invalid message format: %v\n", err)
				continue
			}

			msg.Host = client.host
			msg.Time = time.Now().Format(time.RFC3339)
			s.broadcast <- msg
		}
	}
}

// writePump handles outgoing messages to a client
func (s *ChatServer) writePump(client *Client) {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()

	for {
		select {
		case <-client.ctx.Done():
			return
		case message, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleMessages broadcasts messages to appropriate chat rooms
func (s *ChatServer) handleMessages() {
	for {
		select {
		case <-s.ctx.Done():
			return
		case msg := <-s.broadcast:
			msgBytes, err := json.Marshal(msg)
			if err != nil {
				fmt.Printf("Error encoding message: %v\n", err)
				continue
			}

			s.mu.RLock()
			clients := s.chatRooms[msg.Host]
			s.mu.RUnlock()

			for client := range clients {
				select {
				case client.send <- msgBytes:
				default:
					s.unregisterClient(client)
				}
			}
		}
	}
}

// unregisterClient removes a client from the chat room
func (s *ChatServer) unregisterClient(client *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if clients, exists := s.chatRooms[client.host]; exists {
		if _, ok := clients[client]; ok {
			delete(clients, client)
			close(client.send)
			client.cancel()

			// Clean up empty chat rooms
			if len(clients) == 0 {
				delete(s.chatRooms, client.host)
			}
		}
	}
}
