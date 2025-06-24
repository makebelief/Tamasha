"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getTrendingMovies, getMovieVideos } from "@/lib/tmdb"
import AfroSpinner from "./AfroSpinner"
import PreviewModal from "./PreviewModal"

export default function MainFilmSlider() {
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

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

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
        alert("No trailer available for this movie")
      }
    } catch (error) {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer")
    }
  }

  if (loading) {
    return (
      <section className="relative h-[85vh] flex items-center justify-center bg-black">
        <AfroSpinner />
      </section>
    )
  }

  if (movies.length === 0) {
    return (
      <section className="relative h-[85vh] gradient-orange flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Afroflix</h1>
          <p className="text-xl md:text-2xl">Discover amazing movies and TV shows</p>
        </div>
      </section>
    )
  }

  const currentMovie = movies[currentSlide]

  return (
    <section
      className="carousel-container h-[85vh] relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel Track */}
      <div className="carousel-track h-full">
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <Image
                src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "/placeholder.svg"}
                alt={movie.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge className="bg-orange-500 text-black font-bold px-3 py-1 text-sm">
                    #{index + 1} Trending
                  </Badge>
                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                      <span className="font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.release_date && (
                    <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                      {new Date(movie.release_date).getFullYear()}
                    </Badge>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                  {movie.title}
                </h1>

                <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-200 max-w-2xl">
                  {movie.overview?.substring(0, 200)}
                  {movie.overview?.length > 200 ? "..." : ""}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="btn-modern-primary group"
                    onClick={() => handleWatchTrailer(movie.id)}
                  >
                    <Play className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" />
                    Watch Trailer
                  </Button>
                  <Link href={`/movie/${movie.id}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="btn-modern-secondary w-full sm:w-auto"
                    >
                      <Info className="w-6 h-6 mr-2" />
                      More Info
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="carousel-nav prev" 
        onClick={prevSlide} 
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        className="carousel-nav next" 
        onClick={nextSlide} 
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      <PreviewModal isOpen={showTrailerModal} onClose={() => setShowTrailerModal(false)} trailerKey={trailerKey} />
    </section>
  )
}
