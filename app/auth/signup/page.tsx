"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.fullName.trim()) {
      setError("Please enter your full name")
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError("Please enter a password")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('dsh_users') || '[]')
      const userExists = existingUsers.some((u: any) => u.email === formData.email)
      
      if (userExists) {
        setError("Email already registered")
        setLoading(false)
        return
      }

      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }

      existingUsers.push(newUser)
      localStorage.setItem('dsh_users', JSON.stringify(existingUsers))
      localStorage.setItem('dsh_current_user', JSON.stringify({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      }))

      setFormData({ fullName: "", email: "", password: "", confirmPassword: "" })
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
            <CardTitle className="text-white text-2xl">Create Account</CardTitle>
            <CardDescription className="text-yellow-400/70">Join Digital Skills Hub today</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-yellow-300/80 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-yellow-500/50" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={loading}
                    className="w-full bg-slate-800/50 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:bg-slate-800 transition disabled:opacity-50"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-sm text-yellow-300/80 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-yellow-500/50" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                {loading ? "Creating..." : "Create Account"} <ArrowRight size={18} />
              </Button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300 font-medium transition">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-6">
          By signing up, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  )
}
