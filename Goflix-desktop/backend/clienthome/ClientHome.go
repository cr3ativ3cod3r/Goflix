package clienthome

import (
	"Goflix-Desktop/backend/db"
	"fmt"
)

func ClientHome() []string {

	var responses []string // Define responses slice
	movies,_ := db.GetAllMovies()

	for _, title := range movies { // Iterate over movie titles
		movieInfo, err := db.GetMovieInfo(title) // Pass title instead of index
		if err != nil {
			fmt.Println("Error fetching movie info:", err)
			continue // Skip this movie if there's an error
		}
		responses = append(responses, movieInfo)
	}

	// Do something with `responses`, e.g., return it, print it, or send it over an API
	return responses
}
