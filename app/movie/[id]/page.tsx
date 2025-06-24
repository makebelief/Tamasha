"use client"

import { use } from "react"
import AfroNavigation from "@/components/AfroNavigation"
import FilmDetailsView from "@/components/FilmDetailsView"

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

export default function MoviePage({ params }: MoviePageProps) {
  const { id } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AfroNavigation />
      <div className="pt-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <main className="container mx-auto px-4 py-8 w-full max-w-7xl">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 rounded-3xl blur-3xl" />
            <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-[2rem] blur-2xl" />
            
            {/* Content */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
              <FilmDetailsView id={id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
