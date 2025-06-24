import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { searchMoviesAndTV } from "@/lib/tmdb"
import { debounce } from "@/lib/utils"
import { Film, Tv } from "lucide-react"

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const data = await searchMoviesAndTV(searchQuery, 1)
        setSuggestions(data.results.slice(0, 5)) // Show top 5 results
      } catch (err) {
        console.error("Search error:", err)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleSelect = (item: any) => {
    const type = item.media_type || (item.title ? "movie" : "tv")
    router.push(`/${type}/${item.id}`)
    setQuery("")
    setSuggestions([])
  }

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search movies and TV shows..."
          value={query}
          onValueChange={setQuery}
          className="h-12"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-50">
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {suggestions.map((item) => {
                const type = item.media_type || (item.title ? "movie" : "tv")
                const title = item.title || item.name
                const year = new Date(item.release_date || item.first_air_date).getFullYear()
                
                return (
                  <CommandItem
                    key={`${item.id}-${type}`}
                    value={title}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {type === "movie" ? (
                      <Film className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Tv className="w-4 h-4 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-sm text-gray-500">
                        {type.charAt(0).toUpperCase() + type.slice(1)} • {year || "N/A"}
                      </div>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        )}
        {query && !loading && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-50">
            <CommandEmpty>No results found.</CommandEmpty>
          </div>
        )}
      </Command>
    </div>
  )
} 