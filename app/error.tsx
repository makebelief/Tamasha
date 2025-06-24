"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCcw } from "lucide-react"
import AfroNavigation from "@/components/AfroNavigation"
import AfroFooter from "@/components/AfroFooter"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AfroNavigation />
      
      <main className="container mx-auto px-4 py-16 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="relative max-w-2xl w-full">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 rounded-3xl blur-3xl" />
          <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-[2rem] blur-2xl" />
          
          {/* Content */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-8 text-center">
            <div className="w-24 h-24 gradient-orange rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-4xl">500</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Something Went Wrong</h1>
            <p className="text-gray-300 mb-8 text-lg">
              We're experiencing some technical difficulties. Please try again later.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-orange-500/20 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <AfroFooter />
    </div>
  )
} 