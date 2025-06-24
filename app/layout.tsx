import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: "Tamasha - Kenyan Cinema Redefined",
  description: "Your gateway to discovering the best of Kenyan and East African cinema",
  icons: {
    icon: [
      {
        url: "/tamasha-logo.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "/tamasha-logo.png",
        sizes: "16x16",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "/tamasha-logo.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Tamasha - Kenyan Cinema Redefined",
    description: "Your gateway to discovering the best of Kenyan and East African cinema",
    images: [
      {
        url: "/tamasha-logo.png",
        width: 800,
        height: 800,
        alt: "Tamasha Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Tamasha - Kenyan Cinema Redefined",
    description: "Your gateway to discovering the best of Kenyan and East African cinema",
    images: ["/tamasha-logo.png"]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/tamasha-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/tamasha-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/tamasha-logo.png" />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
