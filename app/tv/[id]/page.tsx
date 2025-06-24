"use client"

import { use } from "react"
import AfroNavigation from "@/components/AfroNavigation"
import SeriesDetailsView from "@/components/SeriesDetailsView"

interface TVPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TVPage({ params }: TVPageProps) {
  const { id } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AfroNavigation />
      <main>
        <SeriesDetailsView id={id} />
      </main>
    </div>
  )
}
