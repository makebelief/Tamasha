const TMDB_BASE_URL = "https://api.themoviedb.org/3"

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTFkN2RlOWZkYjUzODhjNTE2NThlNDg3MTQ2ZDc2ZiIsIm5iZiI6MTc1MDY5MTg1OC43MDIwMDAxLCJzdWIiOiI2ODU5NzAxMjRmMWZlOGMwODI2YmE2ZDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cKSOUSzQ-ykD6_1OOcYzfJEPFRHbTsafMcCJZ6EHtD0",
  },
}

// Cache for API responses
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache(url: string) {
  const cacheKey = url
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}

interface FilterOptions {
  year: [number, number]
  rating: [number, number]
  runtime: [number, number]
  page?: number
  genreId?: number
}

export async function getFilteredMovies(filters: FilterOptions) {
  const { year, rating, runtime, page = 1, genreId } = filters
  const params = new URLSearchParams({
    include_adult: "true",
    include_video: "true",
    language: "en-US",
    page: page.toString(),
    "primary_release_date.gte": `${year[0]}-01-01`,
    "primary_release_date.lte": `${year[1]}-12-31`,
    "vote_average.gte": rating[0].toString(),
    "vote_average.lte": rating[1].toString(),
    "with_runtime.gte": runtime[0].toString(),
    "with_runtime.lte": runtime[1].toString(),
    sort_by: "popularity.desc",
  })

  if (genreId) {
    params.append("with_genres", genreId.toString())
  }

  const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`
  return fetchWithCache(url)
}

export async function getFilteredTV(filters: FilterOptions) {
  const { year, rating, runtime, page = 1, genreId } = filters
  const params = new URLSearchParams({
    include_adult: "true",
    include_null_first_air_dates: "false",
    language: "en-US",
    page: page.toString(),
    "first_air_date.gte": `${year[0]}-01-01`,
    "first_air_date.lte": `${year[1]}-12-31`,
    "vote_average.gte": rating[0].toString(),
    "vote_average.lte": rating[1].toString(),
    "with_runtime.gte": runtime[0].toString(),
    "with_runtime.lte": runtime[1].toString(),
    sort_by: "popularity.desc",
  })

  if (genreId) {
    params.append("with_genres", genreId.toString())
  }

  const url = `${TMDB_BASE_URL}/discover/tv?${params.toString()}`
  return fetchWithCache(url)
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "week") {
  const url = `${TMDB_BASE_URL}/trending/movie/${timeWindow}?language=en-US`
  return fetchWithCache(url)
}

export async function getTrendingTV(timeWindow: "day" | "week" = "week") {
  const url = `${TMDB_BASE_URL}/trending/tv/${timeWindow}?language=en-US`
  return fetchWithCache(url)
}

export async function searchMoviesAndTV(query: string, page = 1) {
  const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=true&language=en-US&page=${page}`
  return fetchWithCache(url)
}

export async function getMovieDetails(id: string) {
  const url = `${TMDB_BASE_URL}/movie/${id}?language=en-US`
  return fetchWithCache(url)
}

export async function getTVDetails(id: string) {
  const url = `${TMDB_BASE_URL}/tv/${id}?language=en-US`
  return fetchWithCache(url)
}

export async function getMovieCredits(id: string) {
  const url = `${TMDB_BASE_URL}/movie/${id}/credits?language=en-US`
  return fetchWithCache(url)
}

export async function getTVCredits(id: string) {
  const url = `${TMDB_BASE_URL}/tv/${id}/credits?language=en-US`
  return fetchWithCache(url)
}

export async function getMovieGenres() {
  const url = `${TMDB_BASE_URL}/genre/movie/list?language=en-US`
  return fetchWithCache(url)
}

export async function getTVGenres() {
  const url = `${TMDB_BASE_URL}/genre/tv/list?language=en-US`
  return fetchWithCache(url)
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const url = `${TMDB_BASE_URL}/discover/movie?include_adult=true&include_video=true&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`
  return fetchWithCache(url)
}

export async function getTVByGenre(genreId: number, page = 1) {
  const url = `${TMDB_BASE_URL}/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`
  return fetchWithCache(url)
}

export async function getPopularMovies(page = 10) {
  const url = `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`
  return fetchWithCache(url)
}

export async function getPopularTV(page = 1) {
  const url = `${TMDB_BASE_URL}/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc`
  return fetchWithCache(url)
}

export async function getMovieRecommendations(id: string) {
  const url = `${TMDB_BASE_URL}/movie/${id}/recommendations?language=en-US&page=1`
  return fetchWithCache(url)
}

export async function getTVRecommendations(id: string) {
  const url = `${TMDB_BASE_URL}/tv/${id}/recommendations?language=en-US&page=1`
  return fetchWithCache(url)
}

export async function getMovieVideos(id: string) {
  const url = `${TMDB_BASE_URL}/movie/${id}/videos?language=en-US`
  return fetchWithCache(url)
}

export async function getTVVideos(id: string) {
  const url = `${TMDB_BASE_URL}/tv/${id}/videos?language=en-US`
  return fetchWithCache(url)
}

export async function getMovieImages(id: string) {
  const url = `${TMDB_BASE_URL}/movie/${id}/images`
  return fetchWithCache(url)
}

export async function getTVImages(id: string) {
  const url = `${TMDB_BASE_URL}/tv/${id}/images`
  return fetchWithCache(url)
}

export async function getMovieWatchProviders(movieId: string) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}/watch/providers`
  const data = await fetchWithCache(url)
  return data
}

export async function getTVWatchProviders(tvId: string) {
  const url = `${TMDB_BASE_URL}/tv/${tvId}/watch/providers`
  const data = await fetchWithCache(url)
  return data
}
