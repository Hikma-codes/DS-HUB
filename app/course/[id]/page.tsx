"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'

const courseData = {
  1: {
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO, social media strategy, content marketing, and analytics.",
    mentor: "Marcus Johnson",
    level: "Beginner",
    duration: "6 weeks",
    videos: [
      {
        id: 1,
        title: "Digital Marketing Fundamentals",
        platform: "YouTube",
        videoId: "dQw4w9WgXcQ",
        duration: "25 min"
      },
      {
        id: 2,
        title: "SEO Essentials for Beginners",
        platform: "YouTube",
        videoId: "tYzMGcUty6s",
        duration: "30 min"
      },
      {
        id: 3,
        title: "Social Media Strategy",
        platform: "YouTube",
        videoId: "jNQXAC9IVRw",
        duration: "28 min"
      },
    ],
    lessons: [
      { id: 1, title: "Introduction to Digital Marketing", duration: "15 min", completed: false },
      { id: 2, title: "Understanding SEO Basics", duration: "20 min", completed: false },
      { id: 3, title: "Social Media Strategy", duration: "18 min", completed: false },
      { id: 4, title: "Content Marketing Essentials", duration: "22 min", completed: false },
      { id: 5, title: "Email Marketing Best Practices", duration: "16 min", completed: false },
      { id: 6, title: "Google Analytics Fundamentals", duration: "25 min", completed: false },
      { id: 7, title: "PPC Advertising Basics", duration: "20 min", completed: false },
      { id: 8, title: "Building Your Brand Online", duration: "18 min", completed: false },
      { id: 9, title: "Social Media Analytics", duration: "17 min", completed: false },
      { id: 10, title: "Digital Marketing Strategy Project", duration: "45 min", completed: false },
    ]
  },
  2: {
    title: "Figma Design Essentials",
    description: "Create beautiful designs with Figma. Learn design principles and prototyping.",
    mentor: "Sarah Chen",
    level: "Beginner",
    duration: "8 weeks",
    videos: [
      {
        id: 1,
        title: "Figma Tutorial for Beginners",
        platform: "YouTube",
        videoId: "II-6dqrs5GU",
        duration: "45 min"
      },
      {
        id: 2,
        title: "Design Fundamentals",
        platform: "YouTube",
        videoId: "YqQx75OPY6c",
        duration: "35 min"
      },
      {
        id: 3,
        title: "UI Design Principles",
        platform: "YouTube",
        videoId: "PZAdY-PH-fA",
        duration: "40 min"
      },
    ],
    lessons: [
      { id: 1, title: "Getting Started with Figma", duration: "15 min", completed: false },
      { id: 2, title: "Design Basics and Tools", duration: "20 min", completed: false },
      { id: 3, title: "Working with Frames and Artboards", duration: "18 min", completed: false },
      { id: 4, title: "Typography in Design", duration: "22 min", completed: false },
      { id: 5, title: "Color Theory and Palettes", duration: "16 min", completed: false },
      { id: 6, title: "Creating Components", duration: "25 min", completed: false },
      { id: 7, title: "Prototyping Interactions", duration: "20 min", completed: false },
      { id: 8, title: "Design Systems in Figma", duration: "18 min", completed: false },
      { id: 9, title: "Collaboration and Handoff", duration: "17 min", completed: false },
      { id: 10, title: "Final Design Project", duration: "60 min", completed: false },
    ]
  },
  3: {
    title: "UI/UX Design Fundamentals",
    description: "Understand user experience design, wireframing, and user testing.",
    mentor: "Elena Rodriguez",
    level: "Beginner",
    duration: "8 weeks",
    videos: [
      {
        id: 1,
        title: "UX Design Fundamentals",
        platform: "YouTube",
        videoId: "c9Wg6Cb_YlU",
        duration: "50 min"
      },
      {
        id: 2,
        title: "User Research Methods",
        platform: "YouTube",
        videoId: "LtqpHQlZeZE",
        duration: "38 min"
      },
      {
        id: 3,
        title: "Wireframing Best Practices",
        platform: "YouTube",
        videoId: "v-bKIILEGkI",
        duration: "42 min"
      },
    ],
    lessons: [
      { id: 1, title: "Introduction to UX Design", duration: "15 min", completed: false },
      { id: 2, title: "User Research Methods", duration: "20 min", completed: false },
      { id: 3, title: "Creating User Personas", duration: "18 min", completed: false },
      { id: 4, title: "Wireframing Principles", duration: "22 min", completed: false },
      { id: 5, title: "Information Architecture", duration: "16 min", completed: false },
      { id: 6, title: "Usability Testing Basics", duration: "25 min", completed: false },
      { id: 7, title: "Accessibility in Design", duration: "20 min", completed: false },
      { id: 8, title: "Design Systems Overview", duration: "18 min", completed: false },
      { id: 9, title: "Mobile Design Considerations", duration: "17 min", completed: false },
      { id: 10, title: "Complete UX Project", duration: "75 min", completed: false },
    ]
  },
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id) as 1 | 2 | 3
  const course = courseData[courseId]
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<number>(1)

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link href="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const toggleLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const progressPercentage = Math.round((completedLessons.length / course.lessons.length) * 100)
  const selectedVideo = course.videos.find(v => v.id === selectedVideoId) || course.videos[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-yellow-900/10 text-white py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 transition">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Course Info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-600/30 text-yellow-200 border border-yellow-500/50">{course.level}</Badge>
              <Badge className="bg-yellow-600/30 text-yellow-200 border border-yellow-500/50">FREE</Badge>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-50">{course.title}</h1>
          <p className="text-yellow-100/70 mb-4">{course.description}</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-yellow-200/60">
            <span className="flex items-center gap-2"><Clock size={16} className="text-yellow-500" /> {course.duration}</span>
            <span>Mentor: <span className="text-yellow-400">{course.mentor}</span></span>
            <span>{course.lessons.length} lessons</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Video */}
            <div className="space-y-4">
              <div className="relative w-full bg-slate-900/50 border border-yellow-500/20 rounded-lg overflow-hidden aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-50">{selectedVideo.title}</h2>
                <p className="text-sm text-yellow-200/60 mt-1">Duration: {selectedVideo.duration}</p>
              </div>
            </div>

            {/* Video Playlist */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-yellow-50">Course Videos</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideoId(video.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedVideoId === video.id
                        ? "bg-yellow-600/20 border border-yellow-500"
                        : "bg-slate-800/30 border border-yellow-500/10 hover:border-yellow-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-yellow-600/20 rounded flex-shrink-0 flex items-center justify-center border border-yellow-500/30">
                        <span className="text-yellow-400 font-bold">{video.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-yellow-50 font-medium truncate">{video.title}</h4>
                        <p className="text-sm text-yellow-200/60">{video.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress and Lessons Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bg-slate-900/50 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-50">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-slate-800/50 rounded-full h-3 mb-2 border border-yellow-500/10">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-yellow-200/70">{completedLessons.length} of {course.lessons.length} lessons completed</p>
              </CardContent>
            </Card>

            {/* Lessons Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-yellow-50">Lessons</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => toggleLessonComplete(lesson.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all border ${
                      completedLessons.includes(lesson.id)
                        ? "bg-yellow-600/20 border-yellow-600/50"
                        : "bg-slate-800/30 border-yellow-500/10 hover:border-yellow-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                        completedLessons.includes(lesson.id)
                          ? "bg-yellow-500 border-yellow-500"
                          : "border-yellow-500/30"
                      }`}>
                        {completedLessons.includes(lesson.id) && <CheckCircle size={14} className="text-black" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-yellow-50 font-medium text-sm truncate">{lesson.title}</h4>
                        <p className="text-xs text-yellow-200/60">{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
