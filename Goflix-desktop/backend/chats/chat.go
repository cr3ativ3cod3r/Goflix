package chats

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket Upgrade Configuration
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Global Variables
var (
	clients   = make(map[*websocket.Conn]bool) // Active WebSocket clients
	broadcast = make(chan []byte)              // Message queue
	mu        sync.Mutex                       // Mutex for safe concurrent access
)

// StartChatServer starts the WebSocket chat server
func StartChatServer() string {
	go handleMessages() // Start message broadcaster

	http.HandleFunc("/ws", wsHandler)

	// Run WebSocket server in a separate goroutine
	go func() {
		fmt.Println("Chat server started on http://localhost:8081/ws")
		err := http.ListenAndServe(":8081", nil)
		if err != nil {
			fmt.Println("WebSocket server error:", err)
		}
	}()

	return "Chat server started!"
}

// WebSocket Connection Handler
func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}

	// Register new client
	mu.Lock()
	clients[conn] = true
	mu.Unlock()

	// Listen for messages from this client
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)

			// Remove client from active list
			mu.Lock()
			delete(clients, conn)
			mu.Unlock()
			break
		}

		// Broadcast message to all clients
		broadcast <- message
	}
}

// Handle message broadcasting to all clients
func handleMessages() {
	for {
		msg := <-broadcast

		mu.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				fmt.Println("Error writing message:", err)
				client.Close()
				delete(clients, client) // Remove disconnected client
			}
		}
		mu.Unlock()
	}
}

//code for connecting clients

var conn *websocket.Conn
var messageCallback func(string) // Callback to send messages to frontend

func ConnectToServer(url string) string {
	var err error
	conn, _, err = websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Println("Error connecting to WebSocket:", err)
		return "Failed to connect"
	}
	log.Println("Connected to WebSocket server")

	go listenForMessages()

	return "Connected"
}

func SendMessageToServer(message string) string {
	if conn == nil {
		return "Not connected to server"
	}
	err := conn.WriteMessage(websocket.TextMessage, []byte(message))
	if err != nil {
		log.Println("Error sending message:", err)
		return "Failed to send message"
	}
	return "Message sent"
}

func listenForMessages() {
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		if messageCallback != nil {
			messageCallback(string(msg))
		}
	}
}

func SetMessageCallback(callback func(string)) {
	messageCallback = callback
}
