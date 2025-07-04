"use client"

import Link from "next/link"
import Image from "next/image"
import { Film, Github } from "lucide-react"

export default function AfroFooter() {
  const basePath = process.env.NODE_ENV === 'production' ? '/Tamasha' : ''
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="relative w-16 h-16">
            <Image
              src={`${basePath}/tamasha-logo.png`}
              alt="Tamasha Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link href="/search" className="hover:text-orange-500 transition-colors">
              Search
            </Link>
            <Link href="/watchlist" className="hover:text-orange-500 transition-colors">
              Watchlist
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://github.com/makebelief/Tamasha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            <p>© {currentYear} Tamasha. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
