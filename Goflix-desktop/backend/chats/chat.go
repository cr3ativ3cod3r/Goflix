package chats

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket Upgrade Configuration
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Global chat rooms mapped by host
var (
	chatRooms = make(map[string]map[*websocket.Conn]bool) // {host: {conn1, conn2, ...}}
	broadcast = make(chan Message)                        // Message queue
	mu        sync.Mutex                                  // Mutex for safe concurrent access
)

// Message struct to include sender, host, and content
type Message struct {
	Host    string `json:"host"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
}

// WebSocket Connection Handler (Now handles multiple hosts)
func WsHandler(w http.ResponseWriter, r *http.Request, host string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}

	// Register new client under the specific host
	mu.Lock()
	if chatRooms[host] == nil {
		chatRooms[host] = make(map[*websocket.Conn]bool)
	}
	chatRooms[host][conn] = true
	mu.Unlock()

	// Listen for messages from this client
	go func() {
		for {
			_, messageBytes, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Error reading message:", err)

				mu.Lock()
				delete(chatRooms[host], conn)
				mu.Unlock()
				conn.Close()
				break
			}

			// Parse message as JSON
			var msg Message
			err = json.Unmarshal(messageBytes, &msg)
			if err != nil {
				fmt.Println("Invalid message format:", err)
				continue
			}

			// Set host and forward message
			msg.Host = host
			broadcast <- msg
		}
	}()
}

// Handle message broadcasting to correct chat room
func handleMessages() {
	for {
		msg := <-broadcast

		// Convert message to JSON
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			fmt.Println("Error encoding message:", err)
			continue
		}

		mu.Lock()
		for client := range chatRooms[msg.Host] {
			err := client.WriteMessage(websocket.TextMessage, msgBytes)
			if err != nil {
				fmt.Println("Error writing message:", err)
				client.Close()
				delete(chatRooms[msg.Host], client) // Remove disconnected client
			}
		}
		mu.Unlock()
	}
}

// Start chat message handling in a goroutine
func InitChatServer() {
	go handleMessages()
}

// {
// 	"sender": "Alice",
// 	"content": "Hello from Alice!"
// }
// frontend input to websocket should be like this
