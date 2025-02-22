package handlers

import (
	"fmt"
	"os"
	"os/exec"
	"log"
	"net/http"
	"time"
)

const hlsOutputDir = "./hls"


func startFFmpeg(inputFile string) {
	cmd := exec.Command("ffmpeg",
		"-i", inputFile,       
		"-codec:v", "libx264", 
		"-preset", "fast",
		"-g", "48", "-keyint_min", "48",
		"-sc_threshold", "0",
		"-hls_time", "4",             
		"-hls_list_size", "6",        
		"-hls_segment_filename", hlsOutputDir+"/segment_%03d.ts", 
		hlsOutputDir+"/playlist.m3u8", 
	)

	
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	err := cmd.Start()
	if err != nil {
		log.Fatalf("Failed to start ffmpeg: %v", err)
	}

	
	go func() {
		err = cmd.Wait()
		if err != nil {
			log.Printf("ffmpeg exited: %v", err)
		}
	}()
}


func serveHLS() {
	http.Handle("/", http.FileServer(http.Dir(hlsOutputDir)))
	fmt.Println("HLS server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func runStream(vidFile string) {
	
	err := os.MkdirAll(hlsOutputDir, os.ModePerm)
	if err != nil {
		log.Fatalf("Failed to create HLS directory: %v", err)
	}

	
	videoFile := vidFile
	startFFmpeg(videoFile)

	
	time.Sleep(5 * time.Second)

	
	serveHLS()
}
