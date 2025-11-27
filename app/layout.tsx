import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { NavigationTransition } from "@/components/navigation-transition"
import { PageTransition } from "@/components/page-transition"
import { Poppins } from "next/font/google"

// Import Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// Metadata for your site (must stay in a server component)
export const metadata: Metadata = {
  title: "Hikma Academy - Learn & Grow",
  description:
    "Explore our comprehensive courses in Web Development, Data Science, and Digital Marketing. Join mentorship programs and accelerate your learning journey.",
}

// RootLayout is now a server component (no "use client" here)
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${poppins.variable}`}>
        {/* Client-only components should have "use client" at the top of their files */}
        <NavigationTransition />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
