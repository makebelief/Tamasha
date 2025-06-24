"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import AfroNavigation from "@/components/AfroNavigation"
import SearchResultsGrid from "@/components/SearchResultsGrid"
import AfroSpinner from "@/components/AfroSpinner"
import FilmFilter from "@/components/FilmFilter"
import { searchMoviesAndTV, getFilteredMovies, getFilteredTV } from "@/lib/tmdb"
import { debounce } from "@/lib/utils"
import type { FilterOptions } from "@/components/FilmFilter"

interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  media_type: "movie" | "tv"
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null)
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie")

  const fetchResults = useCallback(
    async (searchQuery: string, pageNum = 1, filters: FilterOptions | null = null) => {
      if (!searchQuery.trim() && !filters) {
        setResults([])
        return
      }

      setLoading(true)
      setError("")

      try {
        let data
        if (filters) {
          // Use filtered search
          data = await (mediaType === "movie" 
            ? getFilteredMovies({ ...filters, page: pageNum })
            : getFilteredTV({ ...filters, page: pageNum }))
        } else {
          // Use regular search
          data = await searchMoviesAndTV(searchQuery, pageNum)
        }

        if (pageNum === 1) {
          setResults(data.results)
        } else {
          setResults((prev) => [...prev, ...data.results])
        }
        setTotalPages(data.total_pages)
      } catch (err) {
        setError("Failed to search. Please try again.")
        console.error("Search error:", err)
      } finally {
        setLoading(false)
      }
    },
    [mediaType],
  )

  const debouncedSearch = useCallback(
    debounce((searchQuery: string, pageNum = 1, filters: FilterOptions | null = null) => {
      fetchResults(searchQuery, pageNum, filters)
    }, 300),
    [fetchResults],
  )

  useEffect(() => {
    setPage(1)
    debouncedSearch(query, 1, activeFilters)
  }, [query, activeFilters, debouncedSearch])

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters)
    setPage(1)
  }

  const loadMore = () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      debouncedSearch(query, nextPage, activeFilters)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Results</h1>
            {query && <p className="text-gray-600 dark:text-gray-300">Showing results for "{query}"</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMediaType("movie")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  mediaType === "movie"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setMediaType("tv")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  mediaType === "tv"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                TV Shows
              </button>
            </div>
            <FilmFilter onFilterChange={handleFilterChange} mediaType={mediaType} />
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {loading && results.length === 0 ? (
          <AfroSpinner />
        ) : (
          <SearchResultsGrid results={results} onLoadMore={loadMore} hasMore={page < totalPages} loading={loading} />
        )}
      </main>
    </div>
  )
}
