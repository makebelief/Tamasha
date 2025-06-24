package tmdb

import (
	"net/url"
	"strconv"
)

type TrendingResponse struct {
	Page         int         `json:"page"`
	Results      []MediaItem `json:"results"`
	TotalPages   int        `json:"total_pages"`
	TotalResults int        `json:"total_results"`
}

type MediaItem struct {
	ID               int     `json:"id"`
	Title            string  `json:"title,omitempty"`
	Name             string  `json:"name,omitempty"`
	Overview         string  `json:"overview"`
	PosterPath       string  `json:"poster_path"`
	BackdropPath     string  `json:"backdrop_path"`
	VoteAverage      float64 `json:"vote_average"`
	ReleaseDate      string  `json:"release_date,omitempty"`
	FirstAirDate     string  `json:"first_air_date,omitempty"`
	MediaType        string  `json:"media_type"`
	GenreIDs         []int   `json:"genre_ids"`
	OriginalLanguage string  `json:"original_language"`
}

type GenreResponse struct {
	Genres []Genre `json:"genres"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type VideoResponse struct {
	Results []Video `json:"results"`
}

type Video struct {
	Key      string `json:"key"`
	Site     string `json:"site"`
	Type     string `json:"type"`
	Official bool   `json:"official"`
}

type CreditsResponse struct {
	Cast []CastMember `json:"cast"`
	Crew []CrewMember `json:"crew"`
}

type CastMember struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Character   string `json:"character"`
	ProfilePath string `json:"profile_path"`
}

type CrewMember struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Job         string `json:"job"`
	Department  string `json:"department"`
	ProfilePath string `json:"profile_path"`
}

type ImagesResponse struct {
	Backdrops []Image `json:"backdrops"`
	Posters   []Image `json:"posters"`
}

type Image struct {
	FilePath    string  `json:"file_path"`
	AspectRatio float64 `json:"aspect_ratio"`
	Height      int     `json:"height"`
	Width       int     `json:"width"`
	VoteAverage float64 `json:"vote_average"`
	VoteCount   int     `json:"vote_count"`
}

type WatchProvidersResponse struct {
	Results map[string]WatchProviderCountry `json:"results"`
}

type WatchProviderCountry struct {
	Link     string           `json:"link"`
	Flatrate []WatchProvider `json:"flatrate"`
	Rent     []WatchProvider `json:"rent"`
	Buy      []WatchProvider `json:"buy"`
}

type WatchProvider struct {
	DisplayPriority int    `json:"display_priority"`
	LogoPath        string `json:"logo_path"`
	ProviderID      int    `json:"provider_id"`
	ProviderName    string `json:"provider_name"`
}

func (c *Client) GetTrendingMovies(timeWindow string) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/trending/movie/"+timeWindow, params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTrendingTV(timeWindow string) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/trending/tv/"+timeWindow, params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) SearchMulti(query string, page int) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("query", query)
	params.Set("include_adult", "true")
	params.Set("language", "en-US")
	params.Set("page", strconv.Itoa(page))
	
	err := c.get("/search/multi", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieDetails(id string) (*MediaItem, error) {
	var response MediaItem
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/movie/"+id, params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVDetails(id string) (*MediaItem, error) {
	var response MediaItem
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/tv/"+id, params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieCredits(id string) (*CreditsResponse, error) {
	var response CreditsResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/movie/"+id+"/credits", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVCredits(id string) (*CreditsResponse, error) {
	var response CreditsResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/tv/"+id+"/credits", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieGenres() (*GenreResponse, error) {
	var response GenreResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/genre/movie/list", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVGenres() (*GenreResponse, error) {
	var response GenreResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/genre/tv/list", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMoviesByGenre(genreID int, page int) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("include_adult", "true")
	params.Set("include_video", "true")
	params.Set("language", "en-US")
	params.Set("page", strconv.Itoa(page))
	params.Set("sort_by", "popularity.desc")
	params.Set("with_genres", strconv.Itoa(genreID))
	
	err := c.get("/discover/movie", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVByGenre(genreID int, page int) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("include_adult", "true")
	params.Set("include_null_first_air_dates", "false")
	params.Set("language", "en-US")
	params.Set("page", strconv.Itoa(page))
	params.Set("sort_by", "popularity.desc")
	params.Set("with_genres", strconv.Itoa(genreID))
	
	err := c.get("/discover/tv", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetPopularMovies(page int) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("include_adult", "true")
	params.Set("include_video", "true")
	params.Set("language", "en-US")
	params.Set("page", strconv.Itoa(page))
	params.Set("sort_by", "popularity.desc")
	
	err := c.get("/discover/movie", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetPopularTV(page int) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("include_adult", "true")
	params.Set("include_null_first_air_dates", "false")
	params.Set("language", "en-US")
	params.Set("page", strconv.Itoa(page))
	params.Set("sort_by", "popularity.desc")
	
	err := c.get("/discover/tv", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieRecommendations(id string) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("language", "en-US")
	params.Set("page", "1")
	
	err := c.get("/movie/"+id+"/recommendations", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVRecommendations(id string) (*TrendingResponse, error) {
	var response TrendingResponse
	params := url.Values{}
	params.Set("language", "en-US")
	params.Set("page", "1")
	
	err := c.get("/tv/"+id+"/recommendations", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieVideos(id string) (*VideoResponse, error) {
	var response VideoResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/movie/"+id+"/videos", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVVideos(id string) (*VideoResponse, error) {
	var response VideoResponse
	params := url.Values{}
	params.Set("language", "en-US")
	
	err := c.get("/tv/"+id+"/videos", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieImages(id string) (*ImagesResponse, error) {
	var response ImagesResponse
	params := url.Values{}
	
	err := c.get("/movie/"+id+"/images", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVImages(id string) (*ImagesResponse, error) {
	var response ImagesResponse
	params := url.Values{}
	
	err := c.get("/tv/"+id+"/images", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetMovieWatchProviders(id string) (*WatchProvidersResponse, error) {
	var response WatchProvidersResponse
	params := url.Values{}
	
	err := c.get("/movie/"+id+"/watch/providers", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *Client) GetTVWatchProviders(id string) (*WatchProvidersResponse, error) {
	var response WatchProvidersResponse
	params := url.Values{}
	
	err := c.get("/tv/"+id+"/watch/providers", params, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
} 