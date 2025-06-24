"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Calendar, Clock, Heart, Play, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMovieDetails, getMovieCredits, getMovieVideos } from "@/lib/tmdb"
import { useApp } from "@/app/providers"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"
import ShareMovie from "./ShareMovie"
import WatchProviders from "./WatchProviders"
import { PlayCircle } from "lucide-react"

interface FilmDetailsViewProps {
  id: string
}

export default function FilmDetailsView({ id }: FilmDetailsViewProps) {
  const [movie, setMovie] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp()
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([getMovieDetails(id), getMovieCredits(id)])

        setMovie(movieData)
        setCredits(creditsData)
      } catch (err) {
        setError("Failed to load movie details")
        console.error("Error fetching movie details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || "Movie not found"}</p>
      </div>
    )
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.svg?height=800&width=1200"

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const handleWatchlistToggle = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        media_type: "movie",
      })
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleWatchTrailer = async () => {
    try {
      const videosData = await getMovieVideos(id)
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
        setShowTrailerModal(true)
      } else {
        alert("No trailer available for this movie")
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer")
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Poster */}
        <div className="relative w-full lg:w-96 aspect-[2/3] rounded-xl overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{movie.title}</h1>
            <p className="text-gray-400 text-lg italic">{movie.tagline}</p>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-orange-500">
              <Star className="w-5 h-5" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5" />
              <span>{movie.runtime}m</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre: any) => (
              <Badge key={genre.id} variant="outline" className="border-orange-500/50 text-orange-500">
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
            <p className="text-gray-300 leading-relaxed max-w-3xl">{movie.overview}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleWatchTrailer}>
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
            <Button
              variant="outline"
              onClick={handleWatchlistToggle}
              className={`border-orange-500/50 text-orange-500 hover:bg-orange-500/10 ${
                isInWatchlist(movie.id) ? "bg-red-500 border-red-500 hover:bg-red-600" : ""
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isInWatchlist(movie.id) ? "fill-current" : ""}`} />
              {isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
            <ShareMovie title={movie.title} id={movie.id} mediaType="movie" />
            <WatchProviders title={movie.title} id={movie.id} mediaType="movie" />
          </div>

          {/* Cast */}
          {credits?.cast && credits.cast.length > 0 && (
            <div className="pt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {credits.cast.slice(0, 8).map((person: any) => (
                  <div key={person.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/70 transition-colors">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{person.name}</p>
                      <p className="text-xs text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </div>
  )
}
