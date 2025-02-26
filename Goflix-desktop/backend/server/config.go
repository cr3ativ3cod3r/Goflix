package server

import (
	"Goflix-Desktop/backend/chats"
	"Goflix-Desktop/backend/clienthome"
	"Goflix-Desktop/backend/db"
	"Goflix-Desktop/backend/discovery" // Add this import
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
var discoveryService *discovery.Service // Add this variable

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
func CreateServer() {
	cmd := exec.Command("../helpers/stream-helper", "-port", "8081")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	if err := cmd.Start(); err != nil {
		log.Fatalf("Failed to start stream-helper: %v", err)
	}

	db.Connect()

	r := mux.NewRouter()
	r.Use(corsMiddleware)

	r.HandleFunc("/{videoId}/initStream", func(w http.ResponseWriter, r *http.Request) {
		streamHandler(w, r)
	})

	r.HandleFunc("/{host}/chat", func(w http.ResponseWriter, r *http.Request) {
		handleChat(w, r)
	})

	r.HandleFunc("/client/home", ClientHome).Methods("GET")

	// Add a route for mDNS peer discovery
	r.HandleFunc("/peers", func(w http.ResponseWriter, r *http.Request) {
		discoveryService.PeersHandler(w, r)
	}).Methods("GET")

	// Initialize the chat server
	chatServer = chats.NewChatServer()
	chatServer.Start()

	// Initialize and start mDNS service - use a friendly name for your service
	discoveryService = discovery.NewService("Goflix", 8080)
	if err := discoveryService.Start(); err != nil {
		log.Printf("Warning: Failed to start mDNS service: %v", err)
	} else {
		log.Println("mDNS service started successfully")
		// Get the hostname that other devices should use
		hostname := discoveryService.GetFormattedServiceName()
		log.Printf("Service available at: http://%s.local:8080", hostname)
	}

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func GetDiscoveryService() *discovery.Service {
	return discoveryService
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

	videoPath, _ := db.GetVideoPath(videoId)
	if videoPath == "" {
		http.Error(w, "Video not found", http.StatusNotFound)
		return
	}

	log.Println("Video ID:", videoId)
	// log.Println("Video Path:", db.GetVideoPath(videoId))

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

func ClientStreamHandler(ip string, videoId string) (*http.Response, error) {
	url := "http://" + ip + "/" + videoId + "/initStream"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	return resp, nil
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
