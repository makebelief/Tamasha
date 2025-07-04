import AfroNavigation from "@/components/AfroNavigation"
import TVDetailsView from "@/components/TVDetailsView"
import { getTrendingTV } from "@/lib/tmdb"

interface TVPageProps {
  params: {
    id: string
  }
}

// Pre-render pages for trending TV shows
export async function generateStaticParams() {
  try {
    const data = await getTrendingTV()
    if (data.results && data.results.length > 0) {
      // Get IDs from the first 20 trending TV shows
      return data.results.slice(0, 20).map((show: any) => ({
        id: show.id.toString()
      }))
    }
  } catch (error) {
    console.error("Error fetching TV show IDs for static generation:", error)
  }
  
  // Fallback to a few static IDs if the API call fails
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function TVPage({ params }: TVPageProps) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main>
        <TVDetailsView id={id} />
      </main>
    </div>
  )
}
