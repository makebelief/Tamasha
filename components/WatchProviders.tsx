"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getMovieWatchProviders, getTVWatchProviders } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Monitor, PlayCircle } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface WatchProvidersProps {
  id: string | number
  mediaType: "movie" | "tv"
  title: string
}

interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface ProvidersByType {
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}

export default function WatchProviders({ id, mediaType, title }: WatchProvidersProps) {
  const [providers, setProviders] = useState<ProvidersByType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true)
      setError("")

      try {
        const data = await (mediaType === "movie" 
          ? getMovieWatchProviders(id.toString())
          : getTVWatchProviders(id.toString()))

        // Get providers for the user's country (US as default)
        const countryData = data.results?.US || data.results?.KE || null
        setProviders(countryData || null)
      } catch (err) {
        console.error("Error fetching watch providers:", err)
        setError("Failed to load streaming options")
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [id, mediaType])

  const renderProviderList = (providers: Provider[], type: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{type}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {provider.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Monitor className="w-5 h-5" />
          Where to Watch
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Watch {title}</SheetTitle>
          <SheetDescription>
            Available streaming and rental options
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : !providers ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No streaming options available in your region
            </div>
          ) : (
            <div className="space-y-8">
              {providers.flatrate && renderProviderList(providers.flatrate, "Streaming")}
              {providers.rent && renderProviderList(providers.rent, "Rent")}
              {providers.buy && renderProviderList(providers.buy, "Buy")}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 