package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
)

var db *sql.DB
var apikey string

func Connect() {
	var err error
	db, err = sql.Open("sqlite", "./Goflixdb.db")
	if err != nil {
		log.Fatal(err)
	}

	enverr := godotenv.Load()
	if enverr != nil {
		log.Fatal("Error loading .env file")
	}

	apikey = os.Getenv("TMDB_API_KEY")
	if apikey == "" {
		log.Fatal("API key not found in environment")
	}

	// Execute each table creation separately
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS movies (
		id INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		path TEXT NOT NULL,
		overview TEXT,
		releasedate TEXT
	);`)
	if err != nil {
		log.Fatal("Error creating movies table:", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS cast (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		movie_id INTEGER NOT NULL,
		name TEXT NOT NULL,
		character TEXT,
		FOREIGN KEY (movie_id) REFERENCES movies(id)
	);`)
	if err != nil {
		log.Fatal("Error creating cast table:", err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS crew (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		movie_id INTEGER NOT NULL,
		name TEXT NOT NULL,
		job TEXT NOT NULL,
		FOREIGN KEY (movie_id) REFERENCES movies(id)
	);`)
	if err != nil {
		log.Fatal("Error creating crew table:", err)
	}
}

func AddMovieDetails(movie string, path string) {
	id, err := getMovieID(movie)
	if err != nil {
		fmt.Print("Movie not found")
	}
	details, err1 := getMovieDetails(id)
	if err1 != nil {
		fmt.Print("Details not found")
	}
	credits, err2 := getMovieCredits(id)
	if err2 != nil {
		fmt.Print("Credits not found")
	}

	insertDetailsSQL := `INSERT OR IGNORE INTO movies (id, title, path, overview, releasedate) VALUES (?, ?, ?, ?, ?)`
	_, err3 := db.Exec(insertDetailsSQL, id, details.Title, path, details.Overview, details.ReleaseDate)
	if err3 != nil {
		log.Println("Error inserting detaails:", err3)
	}

	insertCastSQL := `INSERT INTO cast (movie_id, name, character) VALUES (?, ?, ?)`
	for _, cast := range credits.Cast {
		_, err := db.Exec(insertCastSQL, id, cast.Name, cast.Character)
		if err != nil {
			log.Println("Error inserting cast:", err)
		}
	}

	// Insert into Crew table
	insertCrewSQL := `INSERT INTO crew (movie_id, name, job) VALUES (?, ?, ?)`
	for _, crew := range credits.Crew {
		_, err := db.Exec(insertCrewSQL, id, crew.Name, crew.Job)
		if err != nil {
			log.Println("Error inserting crew:", err)
		}
	}

}

type MovieSearchResponse struct {
	Results []struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
		Year  string `json:"release_date"`
	} `json:"results"`
}

func getMovieID(movieName string) (int, error) {

	searchURL := fmt.Sprintf("https://api.themoviedb.org/3/search/movie?query=%s&api_key=%s", url.QueryEscape(movieName), apikey)

	resp, err := http.Get(searchURL)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	var searchResults MovieSearchResponse
	body, _ := io.ReadAll(resp.Body)
	json.Unmarshal(body, &searchResults)

	if len(searchResults.Results) == 0 {
		return 0, fmt.Errorf("no movie found with name: %s", movieName)
	}

	return searchResults.Results[0].ID, nil
}

// code to fetch details
type MovieDetails struct {
	Title       string `json:"title"`
	Overview    string `json:"overview"`
	ReleaseDate string `json:"release_date"`
}

func getMovieDetails(movieID int) (MovieDetails, error) {
	apiURL := fmt.Sprintf("https://api.themoviedb.org/3/movie/%d?api_key=%s", movieID, apikey)

	resp, err := http.Get(apiURL)
	if err != nil {
		return MovieDetails{}, err
	}
	defer resp.Body.Close()

	var details MovieDetails
	if err := json.NewDecoder(resp.Body).Decode(&details); err != nil {
		return MovieDetails{}, err
	}

	return details, nil
}

//Code to fetch credits

type CreditResponse struct {
	Cast []struct {
		Name      string `json:"name"`
		Character string `json:"character"`
	} `json:"cast"`
	Crew []struct {
		Name string `json:"name"`
		Job  string `json:"job"`
	} `json:"crew"`
}

func getMovieCredits(movieID int) (CreditResponse, error) {
	apiURL := fmt.Sprintf("https://api.themoviedb.org/3/movie/%d/credits?api_key=%s", movieID, apikey)

	resp, err := http.Get(apiURL)
	if err != nil {
		return CreditResponse{}, err
	}
	defer resp.Body.Close()

	var credits CreditResponse
	if err := json.NewDecoder(resp.Body).Decode(&credits); err != nil {
		return CreditResponse{}, err
	}

	return credits, nil
}

func CreateChat() {
	dropTableSQL := `DROP TABLE IF EXISTS chat;`
	_, err := db.Exec(dropTableSQL)
	if err != nil {
		log.Println("Error dropping tables:", err)
	}

	_, err = db.Exec(`CREATE TABLE chats (
		username TEXT NOT NULL,
		message TEXT NOT NULL
	);`)
	if err != nil {
		log.Println("Error creating movies chats table:", err)
	}
}

type MovieResponse struct {
	Title       string `json:"title"`
	Overview    string `json:"overview"`
	ReleaseDate string `json:"release_date"`
	Cast        []struct {
		Name      string `json:"name"`
		Character string `json:"character"`
	} `json:"cast"`
	Crew []struct {
		Name string `json:"name"`
		Job  string `json:"job"`
	} `json:"crew"`
}

// Function to get all movie details as JSON
func GetMovieInfo(movieName string) (string, error) {
	// Fetch movie ID
	id, err := getMovieID(movieName)
	if err != nil {
		return "", fmt.Errorf("movie not found: %v", err)
	}

	// Fetch movie details
	details, err := getMovieDetails(id)
	if err != nil {
		return "", fmt.Errorf("movie details not found: %v", err)
	}

	// Fetch cast and crew details
	credits, err := getMovieCredits(id)
	if err != nil {
		return "", fmt.Errorf("movie credits not found: %v", err)
	}

	// Create response struct
	response := MovieResponse{
		Title:       details.Title,
		Overview:    details.Overview,
		ReleaseDate: details.ReleaseDate,
		Cast:        credits.Cast,
		Crew:        credits.Crew,
	}

	// Convert to JSON
	jsonResponse, err := json.MarshalIndent(response, "", "  ")
	if err != nil {
		return "", fmt.Errorf("error encoding JSON: %v", err)
	}

	return string(jsonResponse), nil
}
