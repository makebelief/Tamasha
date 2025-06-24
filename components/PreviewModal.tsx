"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  trailerKey: string
}

export default function PreviewModal({ isOpen, onClose, trailerKey }: PreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setError("")
    }
  }, [isOpen])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError("Failed to load trailer. Please try again later.")
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Movie Trailer Preview</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-center p-4">
              <p className="text-lg font-semibold mb-2">Oops!</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* YouTube Iframe */}
        {trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Movie Trailer"
            className="w-full h-full"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-center p-4">
              <p className="text-lg font-semibold mb-2">No Trailer Available</p>
              <p>Sorry, we couldn't find a trailer for this title.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
