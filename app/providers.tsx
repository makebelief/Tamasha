"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

interface WatchlistItem {
  id: number
  title?: string
  name?: string
  poster_path?: string
  media_type: "movie" | "tv"
  watched?: boolean
}

interface AppContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (id: number) => void
  toggleWatched: (id: number) => void
  isInWatchlist: (id: number) => boolean
  clearWatchlist: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load watchlist from localStorage
    const savedWatchlist = localStorage.getItem("afroflix-watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  const addToWatchlist = (item: WatchlistItem) => {
    const newWatchlist = [...watchlist, item]
    setWatchlist(newWatchlist)
    localStorage.setItem("afroflix-watchlist", JSON.stringify(newWatchlist))
  }

  const removeFromWatchlist = (id: number) => {
    const newWatchlist = watchlist.filter((item) => item.id !== id)
    setWatchlist(newWatchlist)
    localStorage.setItem("afroflix-watchlist", JSON.stringify(newWatchlist))
  }

  const toggleWatched = (id: number) => {
    const newWatchlist = watchlist.map((item) => (item.id === id ? { ...item, watched: !item.watched } : item))
    setWatchlist(newWatchlist)
    localStorage.setItem("afroflix-watchlist", JSON.stringify(newWatchlist))
  }

  const isInWatchlist = (id: number) => {
    return watchlist.some((item) => item.id === id)
  }

  const clearWatchlist = () => {
    setWatchlist([])
    localStorage.setItem("afroflix-watchlist", JSON.stringify([]))
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContext.Provider
        value={{
          watchlist,
          addToWatchlist,
          removeFromWatchlist,
          toggleWatched,
          isInWatchlist,
          clearWatchlist,
        }}
      >
        {children}
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a Providers")
  }
  return context
}
