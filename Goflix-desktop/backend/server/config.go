package server

import (
	//"database/sql"
	"Goflix-Desktop/backend/db"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	//"github.com/gorilla/mux"
	//"modernc.org/sqlite"
)

func CreateServer() {
	db.Connect()
	// Create a new router
	r := mux.NewRouter()

	//r.HandleFunc("/home",Home)

	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))

}
