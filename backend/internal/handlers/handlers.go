package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"afroflix/pkg/tmdb"
)

type Handler struct {
	tmdbClient *tmdb.Client
}

func NewHandler(tmdbClient *tmdb.Client) *Handler {
	return &Handler{
		tmdbClient: tmdbClient,
	}
}

func (h *Handler) sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (h *Handler) sendError(w http.ResponseWriter, status int, message string) {
	h.sendJSON(w, status, map[string]string{"error": message})
}

func (h *Handler) GetTrendingMovies(w http.ResponseWriter, r *http.Request) {
	timeWindow := r.URL.Query().Get("time_window")
	if timeWindow == "" {
		timeWindow = "week"
	}

	if timeWindow != "day" && timeWindow != "week" {
		h.sendError(w, http.StatusBadRequest, "invalid time_window parameter")
		return
	}

	movies, err := h.tmdbClient.GetTrendingMovies(timeWindow)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch trending movies")
		return
	}

	h.sendJSON(w, http.StatusOK, movies)
}

func (h *Handler) GetTrendingTV(w http.ResponseWriter, r *http.Request) {
	timeWindow := r.URL.Query().Get("time_window")
	if timeWindow == "" {
		timeWindow = "week"
	}

	if timeWindow != "day" && timeWindow != "week" {
		h.sendError(w, http.StatusBadRequest, "invalid time_window parameter")
		return
	}

	shows, err := h.tmdbClient.GetTrendingTV(timeWindow)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch trending TV shows")
		return
	}

	h.sendJSON(w, http.StatusOK, shows)
}

func (h *Handler) Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if query == "" {
		h.sendError(w, http.StatusBadRequest, "query parameter is required")
		return
	}

	page := 1
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		var err error
		page, err = strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			h.sendError(w, http.StatusBadRequest, "invalid page parameter")
			return
		}
	}

	results, err := h.tmdbClient.SearchMulti(query, page)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to search")
		return
	}

	h.sendJSON(w, http.StatusOK, results)
}

func (h *Handler) GetDetails(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/details/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		details interface{}
		err     error
	)

	switch mediaType {
	case "movie":
		details, err = h.tmdbClient.GetMovieDetails(id)
	case "tv":
		details, err = h.tmdbClient.GetTVDetails(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch details")
		return
	}

	h.sendJSON(w, http.StatusOK, details)
}

func (h *Handler) GetCredits(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/credits/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		credits interface{}
		err     error
	)

	switch mediaType {
	case "movie":
		credits, err = h.tmdbClient.GetMovieCredits(id)
	case "tv":
		credits, err = h.tmdbClient.GetTVCredits(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch credits")
		return
	}

	h.sendJSON(w, http.StatusOK, credits)
}

func (h *Handler) GetGenres(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/genres/")

	var (
		genres interface{}
		err    error
	)

	switch mediaType {
	case "movie":
		genres, err = h.tmdbClient.GetMovieGenres()
	case "tv":
		genres, err = h.tmdbClient.GetTVGenres()
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch genres")
		return
	}

	h.sendJSON(w, http.StatusOK, genres)
}

func (h *Handler) GetByGenre(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/discover/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	genreID, err := strconv.Atoi(parts[1])
	if err != nil {
		h.sendError(w, http.StatusBadRequest, "invalid genre ID")
		return
	}

	page := 1
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		page, err = strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			h.sendError(w, http.StatusBadRequest, "invalid page parameter")
			return
		}
	}

	var results interface{}

	switch mediaType {
	case "movie":
		if parts[1] == "popular" {
			results, err = h.tmdbClient.GetPopularMovies(page)
		} else {
			results, err = h.tmdbClient.GetMoviesByGenre(genreID, page)
		}
	case "tv":
		if parts[1] == "popular" {
			results, err = h.tmdbClient.GetPopularTV(page)
		} else {
			results, err = h.tmdbClient.GetTVByGenre(genreID, page)
		}
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch content")
		return
	}

	h.sendJSON(w, http.StatusOK, results)
}

func (h *Handler) GetVideos(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/videos/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		videos interface{}
		err    error
	)

	switch mediaType {
	case "movie":
		videos, err = h.tmdbClient.GetMovieVideos(id)
	case "tv":
		videos, err = h.tmdbClient.GetTVVideos(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch videos")
		return
	}

	h.sendJSON(w, http.StatusOK, videos)
}

func (h *Handler) GetImages(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/images/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		images interface{}
		err    error
	)

	switch mediaType {
	case "movie":
		images, err = h.tmdbClient.GetMovieImages(id)
	case "tv":
		images, err = h.tmdbClient.GetTVImages(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch images")
		return
	}

	h.sendJSON(w, http.StatusOK, images)
}

func (h *Handler) GetWatchProviders(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/watch/providers/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		providers interface{}
		err      error
	)

	switch mediaType {
	case "movie":
		providers, err = h.tmdbClient.GetMovieWatchProviders(id)
	case "tv":
		providers, err = h.tmdbClient.GetTVWatchProviders(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch watch providers")
		return
	}

	h.sendJSON(w, http.StatusOK, providers)
}

func (h *Handler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	mediaType := strings.TrimPrefix(r.URL.Path, "/api/recommendations/")
	parts := strings.Split(mediaType, "/")
	if len(parts) != 2 {
		h.sendError(w, http.StatusBadRequest, "invalid path")
		return
	}

	mediaType = parts[0]
	id := parts[1]

	var (
		recommendations interface{}
		err            error
	)

	switch mediaType {
	case "movie":
		recommendations, err = h.tmdbClient.GetMovieRecommendations(id)
	case "tv":
		recommendations, err = h.tmdbClient.GetTVRecommendations(id)
	default:
		h.sendError(w, http.StatusBadRequest, "invalid media type")
		return
	}

	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "failed to fetch recommendations")
		return
	}

	h.sendJSON(w, http.StatusOK, recommendations)
} 