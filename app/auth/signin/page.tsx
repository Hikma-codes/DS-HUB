"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem('dsh_users') || '[]')
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

      if (!user) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      localStorage.setItem('dsh_current_user', JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      }))

      router.push("/")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-green-900/10 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg transform -rotate-45"></div>
            <span className="font-bold text-black text-lg relative z-10">DSH</span>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-yellow-500/20 shadow-lg shadow-yellow-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-yellow-400/70">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-yellow-300/80 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-yellow-500/50" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="w-full bg-slate-800/50 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:bg-slate-800 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-yellow-300/80 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-yellow-500/50" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-slate-800/50 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:bg-slate-800 transition disabled:opacity-50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
              </Button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-yellow-400 hover:text-yellow-300 font-medium transition">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-6">
          Having trouble signing in? Contact us at hamzahikma9@gmail.com
        </p>
      </div>
    </div>
  )
}
