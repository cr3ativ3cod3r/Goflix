package db

import (
	_ "modernc.org/sqlite"
)

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

type MovieSearchResponse struct {
	Results []struct {
		ID    int    `json:"id"`
		Title string `json:"title"`
		Year  string `json:"release_date"`
	} `json:"results"`
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

type Review struct {
	Author  string  `json:"author"`
	Content string  `json:"content"`
	Rating  float64 `json:"rating"`
}

type BgResponse struct {
	BackdropPath string `json:"backdrop_path"`
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
