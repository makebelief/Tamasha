import AfroNavigation from "@/components/AfroNavigation"
import FilmDetailsView from "@/components/FilmDetailsView"
import { getTrendingMovies } from "@/lib/tmdb"

interface MoviePageProps {
  params: {
    id: string
  }
}

// Pre-render pages for trending movies
export async function generateStaticParams() {
  try {
    const data = await getTrendingMovies()
    if (data.results && data.results.length > 0) {
      // Get IDs from the first 20 trending movies
      return data.results.slice(0, 20).map((movie: any) => ({
        id: movie.id.toString()
      }))
    }
  } catch (error) {
    console.error("Error fetching movie IDs for static generation:", error)
  }
  
  // Fallback to a few static IDs if the API call fails
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function MoviePage({ params }: MoviePageProps) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main>
        <FilmDetailsView id={id} />
      </main>
    </div>
  )
}
