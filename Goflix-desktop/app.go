package main

import (
	"Goflix-Desktop/backend/server"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Video struct {
	Name string `json:"name"`
	Size string `json:"size"`
	Path string `json:"path"`
}

type App struct {
	ctx context.Context
}

func (a *App) OnShutdown(ctx context.Context) {
	log.Println("Application is shutting down. Cleaning up resources...")
	cmd := exec.Command("pkill", "stream-helper")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	if err := cmd.Start(); err != nil {
		log.Fatalf("Failed to stop stream-helper: %v", err)
	}
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}
func (a *App) GetVideosFromDirectory(directory string) ([]map[string]interface{}, error) {
	var videos []map[string]interface{}

	files, err := os.ReadDir(directory)
	if err != nil {
		return nil, err
	}

	videoExts := map[string]bool{
		".mp4": true,
		".mkv": true,
		".mov": true,
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		ext := strings.ToLower(filepath.Ext(file.Name()))
		if videoExts[ext] {
			filePath := filepath.Join(directory, file.Name())
			fileInfo, err := os.Stat(filePath)
			if err != nil {
				continue
			}

			videos = append(videos, map[string]interface{}{
				"name": file.Name(),
				"size": fmt.Sprintf("%.1f MB", float64(fileInfo.Size())/(1024*1024)),
				"path": filePath,
			})
		}
	}
	fmt.Println(videos)
	return videos, nil
}
func (a *App) SelectDirectory() (string, error) {
	dir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Videos Directory",
	})
	if err != nil {
		return "", err
	}
	return dir, nil
}

func (a *App) StartBackend() error {
	go func() {
		server.CreateServer()
	}()
	return nil
}
func (a *App) AddDataHost(videos []Video) ([]string, error) {

	var videoFiles []server.VideoFile
	for _, video := range videos {
		nameWithoutExt := strings.TrimSuffix(video.Name, filepath.Ext(video.Name))
		videoFiles = append(videoFiles, server.VideoFile{
			Name: nameWithoutExt,
			Path: video.Path,
			Size: video.Size,
		})
	}

	responses, err := server.HostHome(videoFiles)
	if err != nil {
		return nil, fmt.Errorf("error in HostHome: %v", err)
	}

	return responses, nil
}

type StreamResponse struct {
	StatusCode int    `json:"statusCode"`
	URL        string `json:"url"`
	Message    string `json:"message"`
}

func (a *App) ClientStreamHandler(ip string, videoId string) (StreamResponse, error) {
	url := "http://" + ip + "/" + videoId + "/initStream"
	resp, err := http.Get(url)
	if err != nil {
		return StreamResponse{}, err
	}
	defer resp.Body.Close()

	return StreamResponse{
		StatusCode: resp.StatusCode,
		URL:        url,
		Message:    "Stream request sent successfully",
	}, nil
}

// GetPeers returns all active peers from the discovery service
func (a *App) GetPeers() ([]map[string]interface{}, error) {

	println("this was here trying to find peers")
	// Get the discovery service instance
	discoveryService := server.GetDiscoveryService()
	if discoveryService == nil {
		return nil, fmt.Errorf("discovery service not initialized")
	}

	// Get peers from the discovery service
	peers := discoveryService.GetPeers()

	// Convert to a format suitable for frontend
	result := make([]map[string]interface{}, 0, len(peers))
	for _, peer := range peers {
		peerMap := map[string]interface{}{
			"name":     peer.Name,
			"host":     peer.Host,
			"port":     peer.Port,
			"addrIPv4": peer.AddrIPv4,
			"lastSeen": peer.LastSeen,
			"isActive": peer.IsActive,
		}

		if peer.Metadata != nil {
			peerMap["metadata"] = peer.Metadata
			if peer.Metadata["self"] == "true" {
				peerMap["isSelf"] = true
			} else {
				peerMap["isSelf"] = false
			}
		}

		result = append(result, peerMap)
	}
	println("again it was here but lets see if it ca return something")
	return result, nil
}
