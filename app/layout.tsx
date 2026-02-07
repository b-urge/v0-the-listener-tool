import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'The Listener -- Explore the Radio Spectrum',
  description: 'An interactive guide to the electromagnetic spectrum. Drag the tuner to explore the invisible airwaves all around you and discover what ham radio operators hear.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
