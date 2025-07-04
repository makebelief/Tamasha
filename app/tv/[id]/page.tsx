import AfroNavigation from "@/components/AfroNavigation"
import SeriesDetailsView from "@/components/SeriesDetailsView"

interface TVPageProps {
  params: {
    id: string
  }
}

// This is a temporary solution for static export
export async function generateStaticParams() {
  // For static export, we'll pre-render a few popular TV show IDs
  // You should replace these with actual TV show IDs from your data
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    // Add more IDs as needed
  ]
}

export default function TVPage({ params }: TVPageProps) {
  const { id } = params

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main>
        <SeriesDetailsView id={id} />
      </main>
    </div>
  )
}
