import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const basePath = process.env.NODE_ENV === 'production' ? '/Tamasha' : ''

export const metadata: Metadata = {
  title: "Tamasha - Kenyan Cinema Redefined",
  description: "Discover and explore the best of Kenyan and East African cinema.",
  metadataBase: new URL('https://makebelief.github.io/Tamasha'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://makebelief.github.io/Tamasha",
    siteName: "Tamasha",
    title: "Tamasha - Kenyan Cinema Redefined",
    description: "Discover and explore the best of Kenyan and East African cinema.",
    images: [
      {
        url: `${basePath}/tamasha-logo.png`,
        width: 800,
        height: 600,
        alt: "Tamasha Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamasha - Kenyan Cinema Redefined",
    description: "Discover and explore the best of Kenyan and East African cinema.",
    images: [`${basePath}/tamasha-logo.png`],
  },
  icons: {
    icon: [
      {
        url: `${basePath}/tamasha-logo.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${basePath}/tamasha-logo.png`,
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: `${basePath}/tamasha-logo.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/tamasha-logo.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/tamasha-logo.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/tamasha-logo.png`} />
        <link rel="manifest" href={`${basePath}/site.webmanifest`} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
