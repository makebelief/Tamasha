"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrendingMovies, getMovieVideos } from "@/lib/tmdb"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"

export default function SimpleCarousel() {
  const [movies, setMovies] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
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

  // Auto-play every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide, movies.length])

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
      <section className="relative h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <AfroSpinner />
      </section>
    )
  }

  if (movies.length === 0) {
    return (
      <section className="relative h-96 bg-orange-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome to Afroflix</h1>
          <p className="text-lg">Discover amazing movies and TV shows</p>
        </div>
      </section>
    )
  }

  const currentMovie = movies[currentSlide]

  return (
    <section className="carousel-container h-96 relative bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}` : "/placeholder.svg?height=400&width=800"})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{currentMovie.title}</h1>

          <div className="flex items-center space-x-4 mb-4">
            {currentMovie.vote_average > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{currentMovie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {currentMovie.release_date && <span>{new Date(currentMovie.release_date).getFullYear()}</span>}
          </div>

          <p className="text-lg mb-6 opacity-90 line-clamp-2">{currentMovie.overview}</p>

          <div className="flex space-x-4">
            <Button className="yt-button" onClick={() => handleWatchTrailer(currentMovie.id)}>
              <Play className="w-4 h-4 mr-2" />
              Watch Trailer
            </Button>
            <Link href={`/movie/${currentMovie.id}`}>
              <Button
                variant="outline"
                className="yt-button-outline text-white border-white hover:bg-white hover:text-black"
              >
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-orange-500" : "bg-white bg-opacity-50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </section>
  )
}
