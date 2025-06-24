"use client"

import { useState } from "react"
import AfroNavigation from "@/components/AfroNavigation"
import SavedFilmsGrid from "@/components/SavedFilmsGrid"
import ExportWatchlist from "@/components/ExportWatchlist"
import { useApp } from "@/app/providers"
import { Clock, CheckCircle2, Calendar, Film, Tv2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useApp()

  // Calculate statistics
  const totalMovies = watchlist.filter(item => item.media_type === 'movie').length
  const totalTVShows = watchlist.filter(item => item.media_type === 'tv').length
  const totalWatched = watchlist.filter(item => item.watched).length
  const totalUnwatched = watchlist.length - totalWatched

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              My Watchlist
            </h1>
            <div className="flex items-center gap-2">
              {watchlist.length > 0 && (
                <>
                  <ExportWatchlist items={watchlist} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Clear Watchlist
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Watchlist</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to clear your entire watchlist? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearWatchlist} className="bg-red-600 hover:bg-red-700">
                          Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">To Watch</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalUnwatched}</p>
            </div>
            
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watched</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalWatched}</p>
            </div>
            
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center space-x-3">
                <Film className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Movies</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalMovies}</p>
            </div>
            
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center space-x-3">
                <Tv2 className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">TV Shows</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalTVShows}</p>
            </div>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Your watchlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Start adding movies and TV shows to keep track of what you want to watch. You can mark them as watched once you've seen them!
            </p>
          </div>
        ) : (
          <SavedFilmsGrid items={watchlist} />
        )}
      </main>
    </div>
  )
}
