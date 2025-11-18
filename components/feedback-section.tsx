"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star } from 'lucide-react'

const enrolledUsers = [
  { name: "Esi Micah", course: "Digital Marketing Fundamentals" },
  { name: "Stephanie Danso", course: "Figma Design Essentials" },
  { name: "Cecil Essel", course: "UI/UX Design Fundamentals" },
  { name: "Sedoh Julius", course: "Digital Marketing Fundamentals" },
  { name: "Emmanuel Ansah", course: "Figma Design Essentials" },
  { name: "Portia Munku", course: "UI/UX Design Fundamentals" },
  { name: "Christabel Amofa", course: "Digital Marketing Fundamentals" },
  { name: "Emmanuel Amofa", course: "Figma Design Essentials" },
  { name: "Esther Kpeglo", course: "UI/UX Design Fundamentals" },
  { name: "Khadijah Wiafe", course: "Digital Marketing Fundamentals" },
  { name: "Isabella Biney", course: "Figma Design Essentials" },
  { name: "Nsobila Godfred", course: "UI/UX Design Fundamentals" },
  { name: "Raphael Anaba", course: "Digital Marketing Fundamentals" },
  { name: "Daniella Sackey", course: "Figma Design Essentials" },
  { name: "Juwell Amankwah", course: "UI/UX Design Fundamentals" },
]

export function FeedbackSection() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "Digital Marketing Fundamentals",
    feedback: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.feedback) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          course: formData.course,
          rating: rating,
          feedback: formData.feedback,
        }),
      })

      if (response.ok) {
        alert("Thank you for your feedback! Your response has been recorded.")
        setFormData({ name: "", email: "", course: "Digital Marketing Fundamentals", feedback: "" })
        setRating(0)
      } else {
        alert("There was an issue sending your feedback. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("There was an issue sending your feedback. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="feedback" className="min-h-screen py-20 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Student Feedback</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Help us improve by sharing your experience with our courses and platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <Card className="bg-slate-900/50 border-slate-700 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Tell Us Your Experience</CardTitle>
              <p className="text-sm text-gray-400 mt-2">How did you find the course? Was it helpful? Will you come back to learn more?</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-slate-800 border border-slate-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Course</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2 text-sm"
                  >
                    <option>Digital Marketing Fundamentals</option>
                    <option>Figma Design Essentials</option>
                    <option>UI/UX Design Fundamentals</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={
                            star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Your Feedback</label>
                  <Textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    placeholder="How did you find the courses? Was it helpful? Will you come back to learn more?"
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-500 min-h-[120px]"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-medium"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit Feedback"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enrolled Users List */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Our Learners (15 Students)</h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-3">
                {enrolledUsers.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all"
                  >
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.course}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
