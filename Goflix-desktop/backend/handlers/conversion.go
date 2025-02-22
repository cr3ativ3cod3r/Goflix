package handlers

import (
	"Goflix-Desktop/backend/services"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func Conversion(filepath string) *os.File {
	output := services.GetTempFolder() + "/" + filepath[strings.LastIndex(filepath, "/")+1:strings.LastIndex(filepath, ".mp4")] + ".m3u8"
	command := exec.Command("ffmpeg",
		"-i", filepath,
		"-c:v", "libx264", // Use H.264 codec
		"-c:a", "aac", // Use AAC audio codec
		"-b:v", "2500k", // Video bitrate
		"-b:a", "128k", // Audio bitrate
		"-hls_time", "4", // Reduced segment duration for faster starts
		"-hls_list_size", "0", // Keep all segments
		"-hls_segment_filename", fmt.Sprintf("./stream/%s_%%d.ts", filepath[strings.LastIndex(filepath, "/")+1:strings.LastIndex(filepath, ".mp4")]), // Name segments
		"-hls_playlist_type", "vod",
		"-f", "hls", // Force HLS format
		output)
	error := command.Run()
	if error != nil {
		fmt.Print(error)
	}
	out, err := os.Open(output)

	if err != nil {
		fmt.Println("file cant be opened")
	}

	return out
}
