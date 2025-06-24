"use client"

import Link from "next/link"
import Image from "next/image"
import { Film } from "lucide-react"

export default function AfroFooter() {
  return (
    <footer className="bg-black text-white py-16 border-t border-orange-500/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6 group transition-transform duration-300 hover:scale-105">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <Image
                  src="/tamasha-logo.png"
                  alt="Tamasha Logo"
                  width={56}
                  height={56}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">Tamasha</span>
                <p className="text-xs text-orange-500 font-bold -mt-1">KENYAN CINEMA REDEFINED</p>
              </div>
            </Link>
            <p className="text-gray-400">Discover the best of Kenyan and East African cinema.</p>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-orange-500 text-lg">Browse</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-orange-500 transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="hover:text-orange-500 transition-colors">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-orange-500 text-lg">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-orange-500 text-lg">Connect</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-orange-500 transition-colors"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orange-500/30 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tamasha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
