package main

import (
	"Goflix-Desktop/backend/server"
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
	"path/filepath"
	"strings"
)

type App struct {
	ctx context.Context
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
