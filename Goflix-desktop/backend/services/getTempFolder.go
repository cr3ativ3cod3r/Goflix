package services

import (
	"fmt"
	"os"
	"path/filepath"
)

func getTempFolder() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		fmt.Println("Couldn't get config dir")
	}

	path := filepath.Join(configDir, "Goflix", "hls")

	err = os.MkdirAll(path, 0777)

	if err != nil {
		fmt.Print("Folder creation failed")
	}

	return path
}
