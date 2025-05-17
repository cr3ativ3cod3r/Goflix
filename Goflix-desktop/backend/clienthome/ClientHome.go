package clienthome

import (
	"Goflix-Desktop/backend/db"
	"fmt"
)

func ClientHome() []string {

	var responses []string
	movies, _ := db.GetAllMovies()

	for _, title := range movies {
		movieInfo, err := db.GetMovieInfo(title)
		if err != nil {
			fmt.Println("Error fetching movie info:", err)
			continue
		}
		responses = append(responses, movieInfo)
	}

	return responses
}
