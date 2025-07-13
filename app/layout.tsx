import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Royal Map Randomizer",
  description: "Royal Map Randomizer - Get 5 random Royal Maps",
  keywords: ["Trackmania", "maps", "randomizer", "racing", "gaming"],
  openGraph: {
    title: "Royal Map Randomizer",
    description: "Royal Map Randomizer - Get 5 random Royal Maps",
    type: "website",
    // No image specified to prevent preview images
  },
  twitter: {
    card: "summary", // summary instead of summary_large_image
    title: "Royal Map Randomizer", 
    description: "Royal Map Randomizer - Get 5 random Royal Maps",
    // No image specified
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
