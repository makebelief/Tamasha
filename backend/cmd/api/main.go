package main

import (
	"log"
	"net/http"
	"os"

	"afroflix/internal/handlers"
	"afroflix/pkg/tmdb"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Use hardcoded TMDB API token
	apiToken := "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTFkN2RlOWZkYjUzODhjNTE2NThlNDg3MTQ2ZDc2ZiIsIm5iZiI6MTc1MDY5MTg1OC43MDIwMDAxLCJzdWIiOiI2ODU5NzAxMjRmMWZlOGMwODI2YmE2ZDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cKSOUSzQ-ykD6_1OOcYzfJEPFRHbTsafMcCJZ6EHtD0"

	// Create TMDB client
	tmdbClient := tmdb.NewClient(apiToken)

	// Create handlers
	h := handlers.NewHandler(tmdbClient)

	// Create router
	r := mux.NewRouter()

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	
	// Trending routes
	api.HandleFunc("/trending/movies", h.GetTrendingMovies).Methods("GET")
	api.HandleFunc("/trending/tv", h.GetTrendingTV).Methods("GET")
	
	// Search route
	api.HandleFunc("/search", h.Search).Methods("GET")
	
	// Details routes
	api.HandleFunc("/details/{type}/{id}", h.GetDetails).Methods("GET")
	
	// Credits routes
	api.HandleFunc("/credits/{type}/{id}", h.GetCredits).Methods("GET")
	
	// Genres routes
	api.HandleFunc("/genres/{type}", h.GetGenres).Methods("GET")
	
	// Discover routes
	api.HandleFunc("/discover/{type}/{genreId}", h.GetByGenre).Methods("GET")
	
	// Videos routes
	api.HandleFunc("/videos/{type}/{id}", h.GetVideos).Methods("GET")
	
	// Images routes
	api.HandleFunc("/images/{type}/{id}", h.GetImages).Methods("GET")
	
	// Watch providers routes
	api.HandleFunc("/watch/providers/{type}/{id}", h.GetWatchProviders).Methods("GET")
	
	// Recommendations routes
	api.HandleFunc("/recommendations/{type}/{id}", h.GetRecommendations).Methods("GET")

	// Create CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Add your frontend URL
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// Wrap router with CORS middleware
	handler := c.Handler(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
} 