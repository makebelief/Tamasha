"use client"

import { useState, useEffect } from "react"
import { getTrendingMovies, getTrendingTV } from "@/lib/tmdb"
import FilmCard from "./FilmCard"
import AfroSpinner from "./AfroSpinner"
import { Button } from "@/components/ui/button"
import { Film, Tv, TrendingUp } from "lucide-react"

export default function TrendingFilmsGrid() {
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies")
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        const [moviesData, tvData] = await Promise.all([getTrendingMovies(), getTrendingTV()])
        setMovies(moviesData.results || [])
        setTVShows(tvData.results || [])
      } catch (error) {
        console.error("Error fetching trending:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <AfroSpinner />
        </div>
      </section>
    )
  }

  const currentData = activeTab === "movies" ? movies : tvShows

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Trending Now</h2>
              <p className="text-gray-400">What everyone's watching this week</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => setActiveTab("movies")}
              className={activeTab === "movies" ? "btn-orange" : "btn-outline-orange"}
            >
              <Film className="w-4 h-4 mr-2" />
              Movies
            </Button>
            <Button
              onClick={() => setActiveTab("tv")}
              className={activeTab === "tv" ? "btn-orange" : "btn-outline-orange"}
            >
              <Tv className="w-4 h-4 mr-2" />
              TV Shows
            </Button>
          </div>
        </div>

        <div className="grid-responsive">
          {currentData.slice(0, 12).map((item: any) => (
            <FilmCard
              key={item.id}
              item={{
                ...item,
                media_type: activeTab === "movies" ? "movie" : "tv",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
