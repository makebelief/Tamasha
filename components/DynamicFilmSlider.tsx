"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Info, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTrendingMovies, getMovieVideos } from "@/lib/tmdb"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"

export default function ModernCarousel() {
  const [movies, setMovies] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const data = await getTrendingMovies()
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 5))
        }
      } catch (error) {
        console.error("Error fetching featured movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % movies.length)
  }, [movies.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length)
  }, [movies.length])

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, isAutoPlaying, movies.length])

  const handleWatchTrailer = async (movieId: number) => {
    try {
      const videosData = await getMovieVideos(movieId.toString())
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

  if (loading) {
    return (
      <section className="relative h-[70vh] flex items-center justify-center bg-black">
        <AfroSpinner />
      </section>
    )
  }

  if (movies.length === 0) {
    return (
      <section className="relative h-[70vh] bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text-orange">Welcome to Afroflix</h1>
          <p className="text-xl md:text-2xl text-gray-300">Discover amazing movies and TV shows</p>
        </div>
      </section>
    )
  }

  const currentMovie = movies[currentSlide]

  return (
    <section
      className="relative h-[70vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "/placeholder.svg?height=800&width=1200"})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl text-white">
          {/* Movie Info */}
          <div className="flex items-center space-x-4 mb-6">
            <Badge className="bg-orange-500 text-white font-semibold px-4 py-2">#{currentSlide + 1} Trending</Badge>
            {currentMovie.vote_average > 0 && (
              <div className="flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span className="font-semibold">{currentMovie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {currentMovie.release_date && (
              <div className="flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{new Date(currentMovie.release_date).getFullYear()}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">{currentMovie.title}</h1>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200 max-w-3xl">
            {currentMovie.overview?.substring(0, 200)}
            {currentMovie.overview?.length > 200 ? "..." : ""}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="btn-orange text-lg px-8 py-3"
              onClick={() => handleWatchTrailer(currentMovie.id)}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
            <Link href={`/movie/${currentMovie.id}`}>
              <Button size="lg" className="btn-outline-orange text-lg px-8 py-3">
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-orange-500" : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </section>
  )
}
