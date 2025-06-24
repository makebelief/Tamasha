"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Calendar, Tv, Heart, Play, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTVDetails, getTVCredits, getTVVideos } from "@/lib/tmdb"
import { useApp } from "@/app/providers"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"
import ShareMovie from "./ShareMovie"
import WatchProviders from "./WatchProviders"

interface SeriesDetailsViewProps {
  id: string
}

export default function SeriesDetailsView({ id }: SeriesDetailsViewProps) {
  const [show, setShow] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp()
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const [showData, creditsData] = await Promise.all([getTVDetails(id), getTVCredits(id)])

        setShow(showData)
        setCredits(creditsData)
      } catch (err) {
        setError("Failed to load TV show details")
        console.error("Error fetching TV show details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchShowData()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AfroSpinner />
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || "TV show not found"}</p>
      </div>
    )
  }

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : "/placeholder.svg?height=800&width=1200"

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  const handleWatchlistToggle = () => {
    if (isInWatchlist(show.id)) {
      removeFromWatchlist(show.id)
    } else {
      addToWatchlist({
        id: show.id,
        name: show.name,
        poster_path: show.poster_path,
        media_type: "tv",
      })
    }
  }

  const handleWatchTrailer = async () => {
    try {
      const videosData = await getTVVideos(id)
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
        setShowTrailerModal(true)
      } else {
        alert("No trailer available for this TV show")
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer")
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 african-pattern opacity-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-64 mx-auto lg:mx-0">
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={show.name}
                width={256}
                height={384}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{show.name}</h1>

            {show.tagline && <p className="text-xl italic text-orange-300 mb-4">{show.tagline}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {show.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                </div>
              )}

              {show.first_air_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(show.first_air_date).getFullYear()}</span>
                </div>
              )}

              {show.number_of_seasons && (
                <div className="flex items-center space-x-1">
                  <Tv className="w-5 h-5" />
                  <span>
                    {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {show.genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary" className="bg-orange-500/20 text-orange-300">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-lg leading-relaxed mb-8 max-w-3xl">{show.overview}</p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600" onClick={handleWatchTrailer}>
                <Play className="w-5 h-5 mr-2" />
                Watch Trailer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWatchlistToggle}
                className={`border-white text-white hover:bg-white hover:text-gray-900 ${
                  isInWatchlist(show.id) ? "bg-red-500 border-red-500 hover:bg-red-600" : ""
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isInWatchlist(show.id) ? "fill-current" : ""}`} />
                {isInWatchlist(show.id) ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
              <ShareMovie title={show.name} id={show.id} mediaType="tv" />
              <WatchProviders title={show.name} id={show.id} mediaType="tv" />
            </div>
          </div>
        </div>

        {/* Cast */}
        {credits?.cast && credits.cast.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {credits.cast.slice(0, 12).map((person: any) => (
                <div key={person.id} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{person.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </div>
  )
}
