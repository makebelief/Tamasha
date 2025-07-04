"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Calendar, Clock, Heart, Play, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTVDetails, getTVCredits, getTVVideos } from "@/lib/tmdb"
import { useApp } from "@/app/providers"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"
import ShareMovie from "./ShareMovie"
import WatchProviders from "./WatchProviders"
import { PlayCircle } from "lucide-react"

interface TVDetailsViewProps {
  id: string
}

export default function TVDetailsView({ id }: TVDetailsViewProps) {
  const [show, setShow] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp()
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")

  useEffect(() => {
    const fetchTVData = async () => {
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

    fetchTVData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
    <div className="p-6 md:p-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Poster */}
        <div className="relative w-full lg:w-96 aspect-[2/3] rounded-xl overflow-hidden">
          <Image
            src={posterUrl}
            alt={show.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-4 mb-4">
            {show.genres?.map((genre: any) => (
              <Badge key={genre.id} variant="outline" className="border-orange-500/50 text-orange-500">
                {genre.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{show.name}</h1>

          <div className="flex flex-wrap gap-6 text-gray-400 mb-6">
            {show.first_air_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>{new Date(show.first_air_date).getFullYear()}</span>
              </div>
            )}
            {show.vote_average > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                <span>{show.vote_average.toFixed(1)}</span>
              </div>
            )}
            {show.number_of_seasons && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          <p className="text-lg text-gray-300 mb-8">{show.overview}</p>

          {/* Cast */}
          {credits?.cast && credits.cast.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-4">
                {credits.cast.slice(0, 5).map((actor: any) => (
                  <div key={actor.id} className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>{actor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleWatchTrailer}>
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
            <Button
              variant="outline"
              onClick={handleWatchlistToggle}
              className={`border-orange-500/50 text-orange-500 hover:bg-orange-500/10 ${
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

      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </div>
  )
} 