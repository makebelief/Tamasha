"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, Play, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/app/providers"
import PreviewModal from "./PreviewModal"
import { getMovieVideos, getTVVideos } from "@/lib/tmdb"

interface FilmCardProps {
  item: {
    id: number
    title?: string
    name?: string
    poster_path: string
    vote_average?: number
    media_type: "movie" | "tv"
    first_air_date?: string
    release_date?: string
  }
}

export default function FilmCard({ item }: FilmCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp()

  const title = item.title || item.name || "Unknown Title"
  const releaseYear =
    item.release_date || item.first_air_date
      ? new Date(item.release_date || item.first_air_date || "").getFullYear()
      : null

  const posterUrl =
    item.poster_path && !imageError
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "/placeholder.svg?height=400&width=300"

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id)
    } else {
      addToWatchlist({
        id: item.id,
        title: item.title,
        name: item.name,
        poster_path: item.poster_path,
        media_type: item.media_type,
      })
    }
  }

  const handleWatchTrailer = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const videosData =
        item.media_type === "movie" ? await getMovieVideos(item.id.toString()) : await getTVVideos(item.id.toString())

      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
        setShowTrailerModal(true)
      } else {
        alert("No trailer available")
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer")
    }
  }

  return (
    <div className="card-simple group">
      <Link href={`/${item.media_type}/${item.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWatchTrailer}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors"
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </button>
          </div>

          {/* Rating */}
          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Watchlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 w-8 h-8 rounded-full transition-colors ${
              isInWatchlist(item.id)
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-black/70 text-white hover:bg-orange-500"
            }`}
            onClick={handleWatchlistToggle}
          >
            <Heart className={`w-4 h-4 ${isInWatchlist(item.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          {releaseYear && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}</span>
            </div>
          )}
          <span className="text-orange-500 font-medium uppercase">{item.media_type}</span>
        </div>
      </div>

      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </div>
  )
}
