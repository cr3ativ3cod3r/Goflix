package db

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
)

var (
	db     *sql.DB
	apikey string
	mu     sync.Mutex
)

var tmdburl = "https://tmdb-csk2.shuttle.app/tmdb"

type MovieDetails struct {
	Title               string  `json:"title"`
	Overview            string  `json:"overview"`
	ReleaseDate         string  `json:"release_date"`
	Genres              []Genre `json:"genres"`
	Runtime             int     `json:"runtime"`
	Rating              float64 `json:"vote_average"`
	ProductionCountries []struct {
		Name string `json:"name"`
	} `json:"production_countries"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func Connect() error {
	var err error
	db, err = sql.Open("sqlite", "./Goflixdb.db")
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	// Set connection pool limits
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("error loading .env file: %v", err)
	}

	apikey = os.Getenv("TMDB_API_KEY")
	if apikey == "" {
		return fmt.Errorf("API key not found in environment")
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	return initializeTables()
}

func initializeTables() error {
	tables := []string{
		`CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            bgpath TEXT,
            overview TEXT,
            releasedate TEXT,
            genres TEXT,
            runtime INTEGER,
            rating REAL,
            country TEXT
        )`,
		`CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            rating REAL,
            FOREIGN KEY (movie_id) REFERENCES movies(id)
        )`,
		`CREATE TABLE IF NOT EXISTS cast (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            character TEXT,
            FOREIGN KEY (movie_id) REFERENCES movies(id)
        )`,
		`CREATE TABLE IF NOT EXISTS crew (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            job TEXT NOT NULL,
            FOREIGN KEY (movie_id) REFERENCES movies(id)
        )`,
		`CREATE TABLE IF NOT EXISTS chats (
            username TEXT NOT NULL,
            message TEXT NOT NULL
        )`,
	}

	for _, table := range tables {
		if _, err := db.Exec(table); err != nil {
			return fmt.Errorf("failed to create table: %v", err)
		}
	}
	return nil
}

func GetVideoPath(videoId int) (string, error) {
	var path string
	err := db.QueryRow("SELECT path FROM movies WHERE id = ?", videoId).Scan(&path)
	if err != nil {
		return "", fmt.Errorf("error getting video path: %v", err)
	}
	return path, nil
}

func AddMovieDetails(movie, path string) error {
	mu.Lock()
	defer mu.Unlock()

	id, err := getMovieID(movie)
	if err != nil {
		return fmt.Errorf("failed to get movie ID: %v", err)
	}

	details, err := getMovieDetails(id)
	if err != nil {
		return fmt.Errorf("failed to get movie details: %v", err)
	}

	// Start a transaction
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback() // Rollback if we don't commit

	// Insert movie details
	genresJSON, err := json.Marshal(details.Genres)
	if err != nil {
		return fmt.Errorf("failed to marshal genres: %v", err)
	}

	// Get first country name or empty string
	country := ""
	if len(details.ProductionCountries) > 0 {
		country = details.ProductionCountries[0].Name
	}

	_, err = tx.Exec(`
        INSERT OR REPLACE INTO movies 
        (id, title, path, overview, releasedate, genres, runtime, rating, country) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, details.Title, path, details.Overview, details.ReleaseDate,
		string(genresJSON), details.Runtime, details.Rating, country,
	)
	if err != nil {
		return fmt.Errorf("failed to insert movie details: %v", err)
	}

	// Insert reviews
	reviews, err := getMovieReviews(id)
	if err != nil {
		log.Printf("Warning: failed to get reviews: %v", err)
	} else {
		for _, review := range reviews {
			_, err = tx.Exec(`
                INSERT INTO reviews (movie_id, author, content, rating)
                VALUES (?, ?, ?, ?)`,
				id, review.Author, review.Content, review.Rating,
			)
			if err != nil {
				log.Printf("Warning: failed to insert review: %v", err)
			}
		}
	}

	// Insert credits
	credits, err := getMovieCredits(id)
	if err != nil {
		log.Printf("Warning: failed to get credits: %v", err)
	} else {
		for _, cast := range credits.Cast {
			_, err = tx.Exec(
				`INSERT INTO cast (movie_id, name, character) VALUES (?, ?, ?)`,
				id, cast.Name, cast.Character,
			)
			if err != nil {
				log.Printf("Warning: failed to insert cast member: %v", err)
			}
		}

		for _, crew := range credits.Crew {
			_, err = tx.Exec(
				`INSERT INTO crew (movie_id, name, job) VALUES (?, ?, ?)`,
				id, crew.Name, crew.Job,
			)
			if err != nil {
				log.Printf("Warning: failed to insert crew member: %v", err)
			}
		}
	}

	// Update background path
	bg := GetMovieBg(id)
	if bg.BackdropPath != "" {
		_, err = tx.Exec("UPDATE movies SET bgpath = ? WHERE id = ?", bg.BackdropPath, id)
		if err != nil {
			log.Printf("Warning: failed to update background path: %v", err)
		}
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

type MovieSearchResponse struct {
	Results []struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
		Year  string `json:"release_date"`
	} `json:"results"`
}

func getMovieID(movieName string) (int, error) {
	bodyData := map[string]string{
		"url": fmt.Sprintf("search/movie?query=%s&api_key=%s", movieName, apikey),
	}

	jsonBody, err := json.Marshal(bodyData)
	if err != nil {
		panic(err)
	}

	resp, err := http.Post(tmdburl, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	var searchResults MovieSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchResults); err != nil {
		return 0, err
	}

	if len(searchResults.Results) == 0 {
		return 0, fmt.Errorf("no movie found with name: %s", movieName)
	}

	return searchResults.Results[0].ID, nil
}

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
	bodyData := map[string]string{
		"url": fmt.Sprintf("movie/%d/credits?api_key=%s", movieID, apikey),
	}

	jsonBody, err := json.Marshal(bodyData)
	if err != nil {
		panic(err)
	}

	resp, err := http.Post(tmdburl, "application/json", bytes.NewBuffer(jsonBody))
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

type Review struct {
	Author  string  `json:"author"`
	Content string  `json:"content"`
	Rating  float64 `json:"rating"`
}

func getMovieReviews(movieID int) ([]Review, error) {
	bodyData := map[string]string{
		"url": fmt.Sprintf("movie/%d/reviews?api_key=%s", movieID, apikey),
	}

	jsonBody, err := json.Marshal(bodyData)
	if err != nil {
		panic(err)
	}

	resp, err := http.Post(tmdburl, "application/json", bytes.NewBuffer(jsonBody))

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var response struct {
		Results []Review `json:"results"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, err
	}

	return response.Results, nil
}

type BgResponse struct {
	BackdropPath string `json:"backdrop_path"`
}

func GetMovieBg(movieID int) BgResponse {
	bodyData := map[string]string{
		"url": fmt.Sprintf("movie/%d?api_key=%s", movieID, apikey),
	}

	jsonBody, err := json.Marshal(bodyData)
	if err != nil {
		panic(err)
	}

	resp, err := http.Post(tmdburl, "application/json", bytes.NewBuffer(jsonBody))

	if err != nil {
		log.Printf("Warning: failed to fetch backdrop: %v", err)
		return BgResponse{}
	}
	defer resp.Body.Close()

	var bgdata BgResponse
	if err := json.NewDecoder(resp.Body).Decode(&bgdata); err != nil {
		log.Printf("Warning: failed to decode backdrop JSON: %v", err)
		return BgResponse{}
	}

	return bgdata
}

func GetAllMovies() ([]string, error) {
	rows, err := db.Query(`SELECT title FROM movies`)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch movies: %v", err)
	}
	defer rows.Close()

	var movies []string
	for rows.Next() {
		var title string
		if err := rows.Scan(&title); err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}
		movies = append(movies, title)
	}

	return movies, nil
}

type MovieResponse struct {
	Title       string   `json:"title"`
	Overview    string   `json:"overview"`
	ReleaseDate string   `json:"release_date"`
	Bgpath      string   `json:"bg_path"`
	Genres      []string `json:"genres"`
	Runtime     int      `json:"runtime"`
	Rating      float64  `json:"rating"`
	Country     string   `json:"country"`
	Cast        []struct {
		Name      string `json:"name"`
		Character string `json:"character"`
	} `json:"cast"`
	Crew []struct {
		Name string `json:"name"`
		Job  string `json:"job"`
	} `json:"crew"`
	Reviews []Review `json:"reviews"`
}

func GetMovieInfo(movieName string) (string, error) {
	id, err := getMovieID(movieName)
	if err != nil {
		return "", fmt.Errorf("movie not found: %v", err)
	}

	details, err := getMovieDetails(id)
	if err != nil {
		return "", fmt.Errorf("movie details not found: %v", err)
	}

	credits, err := getMovieCredits(id)
	if err != nil {
		return "", fmt.Errorf("movie credits not found: %v", err)
	}

	reviews, err := getMovieReviews(id)
	if err != nil {
		log.Printf("Warning: failed to fetch reviews: %v", err)
	}

	bg := GetMovieBg(id)

	genreNames := make([]string, len(details.Genres))
	for i, genre := range details.Genres {
		genreNames[i] = genre.Name
	}

	country := ""
	if len(details.ProductionCountries) > 0 {
		country = details.ProductionCountries[0].Name
	}

	response := MovieResponse{
		Title:       details.Title,
		Overview:    details.Overview,
		ReleaseDate: details.ReleaseDate,
		Bgpath:      bg.BackdropPath,
		Genres:      genreNames,
		Runtime:     details.Runtime,
		Rating:      details.Rating,
		Country:     country,
		Cast:        credits.Cast,
		Crew:        credits.Crew,
		Reviews:     reviews,
	}

	jsonResponse, err := json.MarshalIndent(response, "", "  ")
	if err != nil {
		return "", fmt.Errorf("error encoding JSON: %v", err)
	}

	return string(jsonResponse), nil
}

func getMovieDetails(movieID int) (MovieDetails, error) {
	bodyData := map[string]string{
		"url": fmt.Sprintf("movie/%d?api_key=%s", movieID, apikey),
	}

	jsonBody, err := json.Marshal(bodyData)
	if err != nil {
		panic(err)
	}

	resp, err := http.Post(tmdburl, "application/json", bytes.NewBuffer(jsonBody))
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
