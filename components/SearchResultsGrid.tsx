"use client"

import FilmCard from "./FilmCard"
import AfroSpinner from "./AfroSpinner"
import { Button } from "@/components/ui/button"

interface SearchResultsGridProps {
  results: any[]
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export default function SearchResultsGrid({ results, onLoadMore, hasMore, loading }: SearchResultsGridProps) {
  if (results.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="african-pattern w-24 h-24 rounded-full mx-auto mb-4 opacity-20"></div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h2>
        <p className="text-gray-600 dark:text-gray-300">Try searching with different keywords</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        {results.map((item: any) => (
          <FilmCard
            key={`${item.id}-${item.media_type}`}
            item={{
              ...item,
              media_type: item.media_type || (item.title ? "movie" : "tv"),
            }}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
          >
            {loading ? <AfroSpinner /> : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
