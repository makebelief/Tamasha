"use client"

import { Check, X, Clock, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import FilmCard from "./FilmCard"
import { useApp } from "@/app/providers"

interface SavedFilmsGridProps {
  items: any[]
}

export default function SavedFilmsGrid({ items }: SavedFilmsGridProps) {
  const { toggleWatched, removeFromWatchlist } = useApp()

  const watchedItems = items.filter((item) => item.watched)
  const unwatchedItems = items.filter((item) => !item.watched)

  return (
    <div className="space-y-12">
      {/* Unwatched Items */}
      {unwatchedItems.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-orange-500" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              To Watch ({unwatchedItems.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {unwatchedItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-3 border border-white/10 shadow-lg transition-transform duration-300 hover:scale-105">
                  <FilmCard item={item} />
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {item.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400"
                        onClick={() => toggleWatched(item.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Watched
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
                        onClick={() => removeFromWatchlist(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watched Items */}
      {watchedItems.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <Check className="w-6 h-6 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Watched ({watchedItems.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchedItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-3 border border-white/10 shadow-lg transition-transform duration-300 hover:scale-105 opacity-80">
                  <FilmCard item={item} />
                  <div className="absolute inset-0 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.release_date || item.first_air_date).getFullYear()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {item.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                        onClick={() => toggleWatched(item.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Unwatch
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
                        onClick={() => removeFromWatchlist(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
