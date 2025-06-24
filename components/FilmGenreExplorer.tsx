"use client"

import { useState, useEffect } from "react"
import { getMovieGenres, getTVGenres, getMoviesByGenre, getTVByGenre } from "@/lib/tmdb"
import FilmCard from "./FilmCard"
import AfroSpinner from "./AfroSpinner"
import { Button } from "@/components/ui/button"
import { Film, Tv, Grid3X3 } from "lucide-react"

export default function FilmGenreExplorer() {
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState<any>(null)
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(false)
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie")

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTVGenres()])

        const allGenres = mediaType === "movie" ? movieGenres.genres : tvGenres.genres
        setGenres(allGenres || [])

        if (allGenres && allGenres.length > 0) {
          setSelectedGenre(allGenres[0])
        }
      } catch (error) {
        console.error("Error fetching genres:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [mediaType])

  useEffect(() => {
    const fetchContentByGenre = async () => {
      if (!selectedGenre) return

      setContentLoading(true)
      try {
        const data =
          mediaType === "movie" ? await getMoviesByGenre(selectedGenre.id) : await getTVByGenre(selectedGenre.id)

        setContent(data.results || [])
      } catch (error) {
        console.error("Error fetching content by genre:", error)
      } finally {
        setContentLoading(false)
      }
    }

    fetchContentByGenre()
  }, [selectedGenre, mediaType])

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <AfroSpinner />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-black relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 african-pattern-black-orange opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-orange float-orange">
              <Grid3X3 className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold neon-orange">Browse by Genre</h2>
              <p className="text-gray-400 text-lg">Discover content by category</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setMediaType("movie")}
              className={mediaType === "movie" ? "btn-orange" : "btn-outline-orange"}
            >
              <Film className="w-5 h-5 mr-2" />
              Movies
            </Button>
            <Button
              onClick={() => setMediaType("tv")}
              className={mediaType === "tv" ? "btn-orange" : "btn-outline-orange"}
            >
              <Tv className="w-5 h-5 mr-2" />
              TV Shows
            </Button>
          </div>
        </div>

        {/* Genre Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {genres.map((genre: any) => (
            <Button
              key={genre.id}
              onClick={() => setSelectedGenre(genre)}
              className={selectedGenre?.id === genre.id ? "btn-orange" : "btn-outline-orange"}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        {contentLoading ? (
          <AfroSpinner />
        ) : (
          <div className="grid-responsive">
            {content.slice(0, 12).map((item: any) => (
              <FilmCard
                key={item.id}
                item={{
                  ...item,
                  media_type: mediaType,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
