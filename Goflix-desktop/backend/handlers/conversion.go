package handlers

import (
	"Goflix-Desktop/backend/services"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func Conversion(filepath string) *os.File {
	output := services.GetTempFolder() + filepath[strings.LastIndex(filepath, "/")+1:strings.LastIndex(filepath, ".mp4")] + ".m3u8"
	command := exec.Command("ffmpeg", "-i", filepath, "-c", "copy", "-hls_time", "10", "-hls_playlist_type", "vod", output)
	error := command.Run()
	if error != nil {
		print(error)
	}
	out, err := os.Open(output)

	if err != nil {
		fmt.Println("file cant be opened")
	}

	return out
}
