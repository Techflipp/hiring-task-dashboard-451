import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CameraVision Analytics",
  description: "Advanced camera management and demographics analytics platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
            <Navigation />
            <main className="pt-16">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
