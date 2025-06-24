# API Documentation

## TMDB API Integration

### Configuration
The application uses TMDB (The Movie Database) API for fetching movie and TV show data. Configuration is done via environment variables:

```env
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_access_token_here
```

### Available Endpoints

#### Movies

##### Get Movie Details
```typescript
async function getMovieDetails(id: string) {
  // Returns detailed information about a specific movie
}
```

##### Get Filtered Movies
```typescript
interface FilterOptions {
  year: [number, number]
  rating: [number, number]
  runtime: [number, number]
  page?: number
  genreId?: number
}

async function getFilteredMovies(filters: FilterOptions) {
  // Returns movies matching the filter criteria
}
```

##### Get Trending Movies
```typescript
async function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  // Returns trending movies for the specified time window
}
```

#### TV Shows

##### Get TV Show Details
```typescript
async function getTVDetails(id: string) {
  // Returns detailed information about a specific TV show
}
```

##### Get Filtered TV Shows
```typescript
async function getFilteredTV(filters: FilterOptions) {
  // Returns TV shows matching the filter criteria
}
```

##### Get Trending TV Shows
```typescript
async function getTrendingTV(timeWindow: "day" | "week" = "week") {
  // Returns trending TV shows for the specified time window
}
```

#### Search

##### Search Movies and TV Shows
```typescript
async function searchMoviesAndTV(query: string, page = 1) {
  // Returns search results for movies and TV shows
}
```

#### Additional Features

##### Get Watch Providers
```typescript
async function getMovieWatchProviders(movieId: string)
async function getTVWatchProviders(tvId: string)
// Returns streaming availability information
```

##### Get Credits
```typescript
async function getMovieCredits(id: string)
async function getTVCredits(id: string)
// Returns cast and crew information
```

### Error Handling
The API client includes:
- Request caching
- Error handling
- Rate limiting protection
- Type safety with TypeScript

### Response Caching
- Cache duration: 5 minutes
- Automatic cache invalidation
- Memory-based caching for performance

### Usage Examples

```typescript
// Get movie details
const movieDetails = await getMovieDetails("123")

// Search with filters
const filteredMovies = await getFilteredMovies({
  year: [2020, 2024],
  rating: [7, 10],
  runtime: [60, 180]
})

// Search content
const searchResults = await searchMoviesAndTV("Matrix")
``` 