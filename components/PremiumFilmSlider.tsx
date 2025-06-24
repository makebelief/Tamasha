"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Info, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTrendingMovies, getMovieVideos } from "@/lib/tmdb"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"

export default function PremiumCarousel() {
  const [movies, setMovies] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [trailerKey, setTrailerKey] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const data = await getTrendingMovies()
        if (data.results && data.results.length > 0) {
          setMovies(data.results.slice(0, 7))
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
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % movies.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [movies.length, isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [movies.length, isTransitioning])

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 800)
    },
    [currentSlide, isTransitioning],
  )

  // Enhanced auto-play with pause on interaction
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0 || isTransitioning) return

    intervalRef.current = setInterval(nextSlide, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [nextSlide, isAutoPlaying, movies.length, isTransitioning])

  const handleWatchTrailer = async (movieId: number) => {
    try {
      const videosData = await getMovieVideos(movieId.toString())
      const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
        setShowTrailerModal(true)
        setIsAutoPlaying(false)
      } else {
        alert("No trailer available for this movie")
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer")
    }
  }

  const getSlideClass = (index: number) => {
    if (index === currentSlide) return "active"
    if (index === (currentSlide - 1 + movies.length) % movies.length) return "prev"
    if (index === (currentSlide + 1) % movies.length) return "next"
    return "inactive"
  }

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <AfroSpinner />
      </section>
    )
  }

  if (movies.length === 0) {
    return (
      <section className="relative h-screen gradient-primary flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-shadow">Welcome to Afroflix</h1>
          <p className="text-2xl md:text-3xl text-shadow">Discover amazing movies and TV shows</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative h-screen overflow-hidden carousel-3d"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center parallax"
              style={{
                backgroundImage: `url(${movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "/placeholder.svg?height=1080&width=1920"})`,
                transform: `scale(${index === currentSlide ? 1.05 : 1})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 gradient-dark opacity-40" />
            <div className="absolute inset-0 african-pattern opacity-10" />
          </div>
        ))}
      </div>

      {/* 3D Carousel Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="relative h-96">
            {movies.map((movie, index) => (
              <div key={movie.id} className={`carousel-slide-3d absolute inset-0 ${getSlideClass(index)}`}>
                <div className="flex items-center h-full">
                  <div className="max-w-4xl text-white">
                    {/* Movie Info */}
                    <div className="flex items-center space-x-4 mb-6">
                      <Badge className="gradient-primary text-white font-bold px-4 py-2 text-lg pulse-glow">
                        #{index + 1} Trending
                      </Badge>
                      {movie.vote_average > 0 && (
                        <div className="flex items-center space-x-2 glass-dark px-4 py-2 rounded-full">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                      {movie.release_date && (
                        <div className="flex items-center space-x-2 glass-dark px-4 py-2 rounded-full">
                          <Calendar className="w-5 h-5 text-orange-400" />
                          <span className="font-semibold">{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                      )}
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-shadow">
                      <span className="gradient-text">{movie.title}</span>
                    </h1>

                    <p className="text-xl md:text-2xl mb-10 leading-relaxed opacity-90 max-w-3xl text-shadow">
                      {movie.overview?.substring(0, 300)}
                      {movie.overview?.length > 300 ? "..." : ""}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Button
                        size="lg"
                        className="btn-primary text-xl px-10 py-4"
                        onClick={() => handleWatchTrailer(movie.id)}
                      >
                        <Play className="w-7 h-7 mr-3" />
                        Watch Trailer
                      </Button>
                      <Link href={`/movie/${movie.id}`}>
                        <Button size="lg" className="btn-secondary text-xl px-10 py-4">
                          <Info className="w-7 h-7 mr-3" />
                          More Info
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <button
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 glass-dark hover:gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pulse-glow"
        onClick={prevSlide}
        disabled={isTransitioning}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 glass-dark hover:gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pulse-glow"
        onClick={nextSlide}
        disabled={isTransitioning}
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Premium Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-4">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "gradient-primary scale-125 pulse-glow"
                  : "bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-black/30 z-20">
        <div
          className="h-full gradient-primary transition-all duration-300 shimmer"
          style={{ width: `${((currentSlide + 1) / movies.length) * 100}%` }}
        />
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-8 right-8 z-20">
        <div
          className={`glass-dark px-4 py-2 rounded-full flex items-center space-x-2 ${isAutoPlaying ? "pulse-glow" : ""}`}
        >
          <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? "gradient-primary" : "bg-gray-400"}`} />
          <span className="text-white text-sm font-semibold">{isAutoPlaying ? "Auto-play ON" : "Auto-play OFF"}</span>
        </div>
      </div>

      {/* Trailer Modal */}
      <PreviewModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        trailerKey={trailerKey}
      />
    </section>
  )
}
