"use client"

import { useState, useEffect } from "react"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTrendingMovies } from "@/lib/tmdb"
import AfroSpinner from "./AfroSpinner"

export default function FilmShowcase() {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const data = await getTrendingMovies()
        if (data.results && data.results.length > 0) {
          // Get a random movie from the first 5 trending movies
          const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length))
          setFeaturedMovie(data.results[randomIndex])
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovie()
  }, [])

  if (loading) {
    return (
      <section className="relative h-[70vh] flex items-center justify-center">
        <AfroSpinner />
      </section>
    )
  }

  if (!featuredMovie) {
    return (
      <section className="relative h-[70vh] bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Afroflix</h1>
          <p className="text-xl md:text-2xl">Discover amazing movies and TV shows</p>
        </div>
      </section>
    )
  }

  const backdropUrl = featuredMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
    : "/placeholder.svg?height=800&width=1200"

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 african-pattern opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {featuredMovie.title || featuredMovie.name}
          </h1>
          <p className="text-lg md:text-xl mb-6 leading-relaxed opacity-90">
            {featuredMovie.overview?.substring(0, 200)}
            {featuredMovie.overview?.length > 200 ? "..." : ""}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Trailer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
