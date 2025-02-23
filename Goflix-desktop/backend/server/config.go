package server

import (
	//"database/sql"
	"Goflix-Desktop/backend/chats"
	clienthome "Goflix-Desktop/backend/client-home"
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
	//"github.com/gorilla/mux"
	//"modernc.org/sqlite"
)

type RequestData struct {
	Items []struct {
		Name string `json:"name"`
		Path string `json:"path"`
	} `json:"items"`
}

func CreateServer() {
	db.Connect()
	// Create a new router
	r := mux.NewRouter()

	//r.HandleFunc("/home",Home)

	fmt.Println("Server is running on http://localhost:8080")

	http.HandleFunc("/{host}/chat", chatHandler)
	http.HandleFunc("/home", HomeHandler) //this is for client homepage

	log.Fatal(http.ListenAndServe(":8080", r))

}

func HostHome(w http.ResponseWriter, r *http.Request) {
	var data RequestData
	var responses []string // Slice to store multiple responses

	// Decode JSON
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return // Stop execution if JSON decoding fails
	}

	// Iterate over the list and call AddMovieDetails
	for _, item := range data.Items {
		db.AddMovieDetails(item.Name, item.Path)
	}

	// Fetch movie details
	for _, item := range data.Items {
		movieInfo, err := db.GetMovieInfo(item.Name) // Assuming GetMovieInfo returns (db.MovieResponse, error)
		if err != nil {
			log.Println("Error fetching movie info:", err)
			continue // Skip this movie if there's an error
		}
		responses = append(responses, movieInfo) // Correct way to append to a slice
	}

	// Convert response to JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(responses)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func ClientHome(w http.ResponseWriter, r *http.Request) {

}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	host := mux.Vars(r)["host"]

	chats.WsHandler(w, r, host)
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

	stream.GetStreamApp().Get("/stream/{videoId}", func(c *fiber.Ctx) error {
		videoPath := db.GetVdeoPath(videoId)
		return handlers.HandleVideoStream(c, videoPath)
	})

}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	resp := clienthome.ClientHome()
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}
