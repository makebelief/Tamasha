"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ExportWatchlistProps {
  items: Array<{
    id: number
    title?: string
    name?: string
    media_type: "movie" | "tv"
    watched?: boolean
  }>
}

export default function ExportWatchlist({ items }: ExportWatchlistProps) {
  const { toast } = useToast()

  const exportAsCSV = () => {
    try {
      // Create CSV content
      const headers = ["Title", "Type", "Status"]
      const rows = items.map((item) => [
        item.title || item.name,
        item.media_type === "movie" ? "Movie" : "TV Show",
        item.watched ? "Watched" : "Not Watched",
      ])
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "tamasha-watchlist.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Watchlist exported!",
        description: "Your watchlist has been exported as CSV.",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export failed",
        description: "Failed to export watchlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportAsPDF = async () => {
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(20)
      doc.text("Tamasha Watchlist", 20, 20)

      // Add content
      doc.setFontSize(12)
      let yPos = 40
      items.forEach((item, index) => {
        const title = item.title || item.name || "Untitled"
        const type = item.media_type === "movie" ? "Movie" : "TV Show"
        const status = item.watched ? "Watched" : "Not Watched"

        // Add a new page if we're running out of space
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }

        doc.text(`${index + 1}. ${title}`, 20, yPos)
        doc.text(`Type: ${type}`, 30, yPos + 7)
        doc.text(`Status: ${status}`, 30, yPos + 14)

        yPos += 25
      })

      // Save the PDF
      doc.save("tamasha-watchlist.pdf")

      toast({
        title: "Watchlist exported!",
        description: "Your watchlist has been exported as PDF.",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export failed",
        description: "Failed to export watchlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={exportAsCSV} className="cursor-pointer">
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF} className="cursor-pointer">
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 