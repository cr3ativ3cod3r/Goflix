package chats

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

func StartChat() {
	//db.CreateChat()
	http.HandleFunc("/chat", wsHandler)
}

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	clients   = make(map[*websocket.Conn]bool) // Active WebSocket clients
	broadcast = make(chan []byte)              // Message queue
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	mu sync.Mutex // To handle concurrent map access
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

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading:", err)
		return
	}
	defer conn.Close()

	mu.Lock()
	clients[conn] = true
	mu.Unlock()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			mu.Lock()
			delete(clients, conn)
			mu.Unlock()
			break
		}
		broadcast <- message // Send message to all clients
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		mu.Lock()
		for client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				fmt.Println("Error writing message:", err)
				client.Close()
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}
