"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ArrowRight, LogOut } from 'lucide-react'
import Link from "next/link"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Courses", href: "#courses" },
  { name: "Mentorship", href: "#mentors" },
  { name: "Admin", href: "/admin" },
]

function DSHLogo() {
  return (
    <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg transform -rotate-45"></div>
        <span className="font-bold text-white text-sm md:text-base relative z-10">DSH</span>
      </div>
    </div>
  )
}

export function GlassmorphismNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const lastScrollY = useRef(0)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const users = JSON.parse(localStorage.getItem("dsh_users") || "[]")
        const currentUser = localStorage.getItem("dsh_current_user")
        if (currentUser) {
          const user = users.find((u: any) => u.email === currentUser)
          if (user) {
            setIsAuthenticated(true)
            setUserName(user.fullName || user.email)
          }
        }
      } catch (error) {
        console.log("[v0] Auth check error:", error)
      }
    }

    const timer = setTimeout(() => {
      setHasLoaded(true)
      checkAuth()
    }, 100)

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
            setIsVisible(false)
          } else if (lastScrollY.current - currentScrollY > 5) {
            setIsVisible(true)
          }
        } else {
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true })
      window.addEventListener("storage", checkAuth)

      return () => {
        window.removeEventListener("scroll", controlNavbar)
        window.removeEventListener("storage", checkAuth)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (href: string) => {
    if (href.startsWith("/")) {
      return
    }

    const element = document.querySelector(href)
    if (element) {
      const rect = element.getBoundingClientRect()
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const elementAbsoluteTop = rect.top + currentScrollY
      const navbarHeight = 100
      const targetPosition = Math.max(0, elementAbsoluteTop - navbarHeight)

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
    setIsOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("dsh_current_user")
    setIsAuthenticated(false)
    setUserName("")
    setIsOpen(false)
    window.location.href = "/"
  }

  return (
    <>
      <nav
        className={`fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 md:-translate-y-24 opacity-0"
        } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{
          transition: hasLoaded ? "all 0.5s ease-out" : "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Main Navigation */}
        <div className="w-[90vw] max-w-xs md:max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 md:px-6 md:py-2">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer flex-shrink-0"
              >
                <DSHLogo />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
                {navigation.map((item) =>
                  item.href.startsWith("/") ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white/80 hover:text-white hover:scale-105 transition-all duration-200 font-medium cursor-pointer text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="text-white/80 hover:text-white hover:scale-105 transition-all duration-200 font-medium cursor-pointer text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </button>
                  ),
                )}
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex gap-3 items-center flex-shrink-0">
                {isAuthenticated ? (
                  <>
                    <span className="text-white/80 text-sm font-medium px-3 py-1">Welcome, {userName.split(' ')[0]}</span>
                    <button
                      onClick={handleLogout}
                      className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="relative bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-medium px-6 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group whitespace-nowrap"
                    >
                      <span className="mr-2">Sign Up</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="relative bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 font-medium px-6 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group whitespace-nowrap"
                    >
                      <span className="mr-2">Sign In</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white hover:scale-110 transition-transform duration-200 cursor-pointer flex-shrink-0"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
            style={{ top: "0", left: "0", right: "0", bottom: "0", zIndex: -1 }}
          />

          <div
            className={`mt-2 w-[90vw] max-w-xs mx-auto transition-all duration-500 ease-out transform-gpu ${
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col space-y-1">
                {navigation.map((item, index) =>
                  item.href.startsWith("/") ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1 ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1 ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                      }}
                    >
                      {item.name}
                    </button>
                  ),
                )}
                <div className="h-px bg-white/10 my-2" />
                {isAuthenticated ? (
                  <>
                    <div
                      className={`text-white/80 text-sm font-medium px-3 py-3 ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${navigation.length * 80 + 150}ms` : "0ms",
                      }}
                    >
                      Welcome, {userName.split(' ')[0]}
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group transform w-full justify-center ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${navigation.length * 80 + 230}ms` : "0ms",
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className={`relative bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-medium px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group transform w-full ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${navigation.length * 80 + 150}ms` : "0ms",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2">Sign Up</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/auth/signin"
                      className={`relative bg-green-500/20 hover:bg-green-500/30 text-white border border-green-500/50 font-medium px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group transform w-full ${
                        isOpen ? "animate-mobile-menu-item" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${navigation.length * 80 + 230}ms` : "0ms",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-2">Sign In</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
