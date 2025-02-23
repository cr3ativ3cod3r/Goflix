package server

import (
	"Goflix-Desktop/backend/chats"
	"Goflix-Desktop/backend/clienthome"
	"Goflix-Desktop/backend/db"
	"Goflix-Desktop/backend/handlers"
	"Goflix-Desktop/backend/stream"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
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
	db.Connect()

	// Initialize the chat server
	chatServer = chats.NewChatServer()
	chatServer.Start()

	// Create a new router
	r := mux.NewRouter()

	// Register routes
	//r.HandleFunc("/host/home", HostHome)
	r.HandleFunc("/client/home", ClientHome)
	r.HandleFunc("/{host}/chat", handleChat)
	r.HandleFunc("/stream/{videoId}", streamHandler)

	fmt.Println("Server is running on http://localhost:8080")
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
	vars := mux.Vars(r)
	videoIdStr := vars["videoId"]
	videoId, err := strconv.Atoi(videoIdStr)
	if err != nil {
		http.Error(w, "Invalid video ID", http.StatusBadRequest)
		return
	}

	stream.GetStreamApp().Get("/stream/{videoId}", func(c *fiber.Ctx) error {
		videoPath := db.GetVdeoPath(videoId)
		return handlers.HandleVideoStream(c, videoPath)
	})
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
