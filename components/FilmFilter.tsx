"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface FilmFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  mediaType: "movie" | "tv"
}

export interface FilterOptions {
  year: [number, number]
  rating: [number, number]
  runtime: [number, number]
}

const currentYear = new Date().getFullYear()

export default function FilmFilter({ onFilterChange, mediaType }: FilmFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    year: [1900, currentYear],
    rating: [0, 10],
    runtime: [0, 300],
  })

  const handleYearChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, year: [value[0], value[1]] as [number, number] }))
  }

  const handleRatingChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, rating: [value[0], value[1]] as [number, number] }))
  }

  const handleRuntimeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, runtime: [value[0], value[1]] as [number, number] }))
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
  }

  const handleResetFilters = () => {
    const defaultFilters: FilterOptions = {
      year: [1900, currentYear],
      rating: [0, 10],
      runtime: [0, 300],
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Filter {mediaType === "movie" ? "movies" : "TV shows"} by year, rating, and {mediaType === "movie" ? "runtime" : "episode length"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Year Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year Range
              </Label>
              <span className="text-sm text-muted-foreground">
                {filters.year[0]} - {filters.year[1]}
              </span>
            </div>
            <Slider
              min={1900}
              max={currentYear}
              step={1}
              value={[filters.year[0], filters.year[1]]}
              onValueChange={handleYearChange}
              className="w-full"
            />
          </div>

          {/* Rating Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rating Range
              </Label>
              <span className="text-sm text-muted-foreground">
                {filters.rating[0]} - {filters.rating[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.5}
              value={[filters.rating[0], filters.rating[1]]}
              onValueChange={handleRatingChange}
              className="w-full"
            />
          </div>

          {/* Runtime Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {mediaType === "movie" ? "Runtime" : "Episode Length"} (minutes)
              </Label>
              <span className="text-sm text-muted-foreground">
                {filters.runtime[0]} - {filters.runtime[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={300}
              step={5}
              value={[filters.runtime[0], filters.runtime[1]]}
              onValueChange={handleRuntimeChange}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleResetFilters} variant="outline" className="flex-1">
              Reset
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 