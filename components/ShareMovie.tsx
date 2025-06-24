"use client"

import { Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ShareMovieProps {
  title: string
  id: string | number
  mediaType: "movie" | "tv"
}

export default function ShareMovie({ title, id, mediaType }: ShareMovieProps) {
  const { toast } = useToast()
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const contentUrl = `${baseUrl}/${mediaType}/${id}`

  const handleShare = async (platform: string) => {
    const text = `Check out "${title}" on Tamasha!`

    switch (platform) {
      case "facebook":
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`
        window.open(fbShareUrl, "_blank", "width=600,height=400")
        break
      case "twitter":
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(contentUrl)}`
        window.open(twitterShareUrl, "_blank", "width=600,height=400")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(contentUrl)
          toast({
            title: "Link copied!",
            description: "The movie link has been copied to your clipboard.",
          })
        } catch (err) {
          console.error("Failed to copy link:", err)
          toast({
            title: "Failed to copy link",
            description: "Please try again.",
            variant: "destructive",
          })
        }
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
          <Share2 className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
          <LinkIcon className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 