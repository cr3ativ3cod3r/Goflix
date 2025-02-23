package main

import (
	"Goflix-Desktop/backend/server"
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
	"path/filepath"
	"strings"
	"log"
	"os/exec"
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
	cmd := exec.Command("pkill", "stream-helper",)
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
