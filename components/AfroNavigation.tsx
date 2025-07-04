"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, Sun, Moon, Film, BookmarkCheck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/app/providers"
import { useTheme } from "next-themes"
import SearchAutocomplete from "./SearchAutocomplete"

export default function AfroNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { watchlist } = useApp()
  const { theme, setTheme } = useTheme()
  const basePath = process.env.NODE_ENV === 'production' ? '/Tamasha' : ''

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-800/50"
          : "bg-white/5 dark:bg-gray-900/20 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Image
                src={`${basePath}/tamasha-logo.png`}
                alt="Tamasha Logo"
                width={64}
                height={64}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                Tamasha
              </span>
              <span className="text-xs font-semibold tracking-wider text-orange-500/80">KENYAN CINEMA REDEFINED</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <div className="w-[320px] relative">
              <SearchAutocomplete />
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="nav-link group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
              >
                <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Home</span>
              </Link>

              <Link
                href="/watchlist"
                className="nav-link group flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
              >
                <div className="relative">
                  <BookmarkCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {watchlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-orange-500 text-white rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </div>
                <span className="font-medium">Watchlist</span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 border border-gray-200/20 dark:border-gray-700/50 transition-all duration-300"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-orange-500 transition-transform hover:scale-110 duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-orange-500 transition-transform hover:scale-110 duration-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 border border-gray-200/20 dark:border-gray-700/50 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-20 p-4 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/50">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <SearchAutocomplete />
              </div>

              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  href="/watchlist"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <BookmarkCheck className="w-5 h-5" />
                      {watchlist.length > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-orange-500 text-white rounded-full">
                          {watchlist.length}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">Watchlist</span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full justify-start space-x-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-orange-500" />
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
