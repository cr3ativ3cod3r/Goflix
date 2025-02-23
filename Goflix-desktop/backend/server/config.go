package server

import (
	"Goflix-Desktop/backend/chats"
	"Goflix-Desktop/backend/clienthome"
	"Goflix-Desktop/backend/db"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"strconv"

	"github.com/gorilla/mux"
)

type RequestData struct {
	Items []struct {
		Name string `json:"name"`
		Path string `json:"path"`
	} `json:"items"`
}

var chatServer *chats.ChatServer

func CreateServer() {
	cmd := exec.Command("../helpers/stream-helper", "-port", "8081")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	if err := cmd.Start(); err != nil {
		log.Fatalf("Failed to start stream-helper: %v", err)
	}

	db.Connect()

	// Create a new router
	r := mux.NewRouter()

	// Register your specific routes FIRST
	r.HandleFunc("/{videoId}/initStream", func(w http.ResponseWriter, r *http.Request) {
		streamHandler(w, r)
	})

	r.HandleFunc("/{host}/chat", func(w http.ResponseWriter, r *http.Request) {
		handleChat(w, r)
	})

	r.HandleFunc("/client/home", ClientHome).Methods("GET")

	// Initialize the chat server
	chatServer = chats.NewChatServer()
	chatServer.Start()

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

type VideoFile struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Size string `json:"size"`
}

func HostHome(items []VideoFile) ([]string, error) {
	var responses []string
	for _, item := range items {
		db.AddMovieDetails(item.Name, item.Path)
	}

	for _, item := range items {
		movieInfo, err := db.GetMovieInfo(item.Name)
		if err != nil {
			log.Println("Error fetching movie info:", err)
			continue
		}
		responses = append(responses, movieInfo)
	}

	return responses, nil
}

func handleChat(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	host := vars["host"]
	chatServer.HandleWebSocket(w, r, host)
}

func streamHandler(w http.ResponseWriter, r *http.Request) {
	// Get the video path
	vars := mux.Vars(r)
	videoIdStr := vars["videoId"]
	videoId, err := strconv.Atoi(videoIdStr)
	if err != nil {
		http.Error(w, "Invalid video ID", http.StatusBadRequest)
		return
	}

	videoPath := db.GetVideoPath(videoId)
	if videoPath == "" {
		http.Error(w, "Video not found", http.StatusNotFound)
		return
	}

	log.Println("Video ID:", videoId)
	log.Println("Video Path:", db.GetVideoPath(videoId))

	post_url := "http://localhost:8081/register"

	// JSON body
	body, err := json.Marshal(map[string]string{
		"id":   videoIdStr,
		"path": videoPath,
	})
	if err != nil {
		log.Println("Error marshalling JSON:", err)
		return
	}

	req, err := http.NewRequest("POST", post_url, bytes.NewBuffer(body))
	if err != nil {
		log.Println("Error creating request:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Println("Unexpected status code:", resp.StatusCode)
	} else {
		log.Println("Stream request sent successfully")
	}

}

func ClientHome(w http.ResponseWriter, r *http.Request) {
	resp := clienthome.ClientHome()
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func ClientHomeHelper(ip string) any {
	resp, err := http.Get("http://" + ip + "/client/home")
	if err != nil {
		return "Request failed"
	}
	return resp
}
