"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO, social media strategy, content marketing, and analytics. Master the art of reaching and engaging your audience online.",
    level: "Beginner",
    duration: "6 weeks",
    enrolled: 12,
    mentor: "Marcus Johnson",
    lessons: 10,
  },
  {
    id: 2,
    title: "Figma Design Essentials",
    description: "Create beautiful designs with Figma. Learn design principles, prototyping, and collaboration tools to bring your ideas to life.",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 8,
    mentor: "Sarah Chen",
    lessons: 10,
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Understand user experience design, wireframing, user testing, and design systems. Create intuitive interfaces that users love.",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 11,
    mentor: "Elena Rodriguez",
    lessons: 10,
  },
]

export function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])

  const handleEnroll = (courseId: number) => {
    window.location.href = `/course/${courseId}`
  }

  return (
    <section id="courses" className="min-h-screen py-20 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Available Courses</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Beginner-friendly courses to help you master in-demand digital skills
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="bg-slate-900/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer flex flex-col"
              onClick={() => setSelectedCourse(course.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-900/30 text-green-300"
                  >
                    {course.level}
                  </Badge>
                  <span className="text-lg font-bold text-white">FREE</span>
                </div>
                <CardTitle className="text-white text-xl">{course.title}</CardTitle>
                <CardDescription className="text-gray-300 text-sm">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock size={16} className="text-blue-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users size={16} className="text-blue-400" />
                    <span>{course.enrolled} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-blue-400">📚</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400">👨‍🏫</span>
                    <span>Mentor: {course.mentor}</span>
                  </div>
                </div>
                <Button 
                  className={`w-full rounded-lg transition-all ${
                    enrolledCourses.includes(course.id)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEnroll(course.id)
                  }}
                >
                  {enrolledCourses.includes(course.id) ? "✓ Enrolled" : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Info */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 text-center">
          <p className="text-white">All courses are <span className="font-bold text-green-400">100% FREE</span> and include lifetime access to course materials.</p>
        </div>
      </div>
    </section>
  )
}
