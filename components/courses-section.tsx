"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from 'lucide-react'

// Convert a YouTube watch/share URL to an embed URL. Falls back to the original URL.
function toEmbedUrl(url: string | undefined) {
  if (!url) return ""
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      // If it's already an embed path, return as-is
      if (u.pathname.includes('/embed/')) return url
    }
    if (host.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    return url
  } catch (e) {
    return url
  }
}

const courses = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    description: "Learn SEO, social media strategy, content marketing, and analytics. Master the art of reaching and engaging your audience online.",
    level: "Beginner",
    duration: "6 weeks",
    enrolled: 12,
    mentor: "Marcus Johnson",
    lessons: [
      { title: "Intro to Digital Marketing", url: "https://www.youtube.com/watch?v=PLACEHOLDER_1" },
      { title: "SEO Basics", url: "https://www.youtube.com/watch?v=PLACEHOLDER_2" },
      { title: "Social Media Strategy", url: "https://www.youtube.com/watch?v=PLACEHOLDER_3" },
      { title: "Content Marketing", url: "https://www.youtube.com/watch?v=PLACEHOLDER_4" },
      { title: "Analytics & Reporting", url: "https://www.youtube.com/watch?v=PLACEHOLDER_5" },
    ],
  },
  {
    id: 2,
    title: "Figma Design Essentials",
    description: "Create beautiful designs with Figma. Learn design principles, prototyping, and collaboration tools to bring your ideas to life.",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 8,
    mentor: "Sarah Chen",
    lessons: [
      { title: "Getting Started with Figma", url: "https://www.youtube.com/watch?v=PLACEHOLDER_6" },
      { title: "Design Systems in Figma", url: "https://www.youtube.com/watch?v=PLACEHOLDER_7" },
      { title: "Prototyping Basics", url: "https://www.youtube.com/watch?v=PLACEHOLDER_8" },
      { title: "Collaboration & Handoff", url: "https://www.youtube.com/watch?v=PLACEHOLDER_9" },
      { title: "Advanced Figma Tips", url: "https://www.youtube.com/watch?v=PLACEHOLDER_10" },
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Understand user experience design, wireframing, user testing, and design systems. Create intuitive interfaces that users love.",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 11,
    mentor: "Elena Rodriguez",
    lessons: [
      { title: "Intro to UX", url: "https://www.youtube.com/watch?v=PLACEHOLDER_11" },
      { title: "User Research & Personas", url: "https://www.youtube.com/watch?v=PLACEHOLDER_12" },
      { title: "Wireframing & Prototyping", url: "https://www.youtube.com/watch?v=PLACEHOLDER_13" },
      { title: "Usability Testing", url: "https://www.youtube.com/watch?v=PLACEHOLDER_14" },
      { title: "Design Systems", url: "https://www.youtube.com/watch?v=PLACEHOLDER_15" },
    ],
  },
]

export function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0)
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
  const [remoteCourses, setRemoteCourses] = useState<any[] | null>(null)
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false)
  const [progressMap, setProgressMap] = useState<Record<number, number>>({})

  // Try to load courses from the API endpoint if available. Falls back to local `courses` const.
  useEffect(() => {
    let mounted = true
    setLoadingCourses(true)
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (data && data.success && Array.isArray(data.courses)) {
          // Normalize remote course shape: map `videos` -> `lessons` expected by this component
          const normalized = data.courses.map((c: any) => ({
            ...c,
            lessons: Array.isArray(c.lessons)
              ? c.lessons
              : Array.isArray(c.videos)
                ? c.videos.map((v: any) => ({ title: v.title || v.name || "Lesson", url: v.url }))
                : c.lessons || [],
          }))
          console.log("Fetched courses (normalized)", normalized)
          setRemoteCourses(normalized)
        }
      })
      .catch(() => {
        // ignore and keep local fallback
      })
      .finally(() => mounted && setLoadingCourses(false))

    return () => {
      mounted = false
    }
  }, [])

  // Build progress map from localStorage (best-effort). Key: course id -> percent complete
  useEffect(() => {
    const list = remoteCourses || courses
    const map: Record<number, number> = {}
    try {
      list.forEach((c: any) => {
        const key = `course-progress-${c.id}`
        const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
              const total = Array.isArray(c.lessons) ? c.lessons.length : 0
              map[c.id] = total === 0 ? 0 : Math.round((parsed.length / total) * 100)
            }
          } catch (e) {
            // ignore malformed
          }
        }
      })
    } catch (e) {
      // ignore
    }
    setProgressMap(map)
  }, [remoteCourses])

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
          {(remoteCourses || courses).map((course) => (
            <Card
              key={course.id}
              className="bg-slate-900/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer flex flex-col"
              onClick={() => {
                setSelectedCourse(course.id)
                setSelectedLessonIndex(0)
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-900/30 text-green-300">{course.level}</Badge>
                    {progressMap[course.id] !== undefined && (
                      <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">{progressMap[course.id]}%</Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-white">FREE</span>
                  </div>
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
                    <span>{Array.isArray(course.lessons) ? course.lessons.length : course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400">👨‍🏫</span>
                    <span>Mentor: {course.mentor}</span>
                  </div>
                </div>
                <Button
                  className={`w-full rounded-lg transition-all ${enrolledCourses.includes(course.id)
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
                {/* If this course is selected, show embedded player + lesson list */}
                {selectedCourse === course.id && (
                  <div className="mt-4 text-sm text-gray-200">
                    <h4 className="font-semibold text-white mb-2">Lessons</h4>

                    {/* Helper: convert YouTube watch/share URLs to embed URL */}
                    <div className="mb-3">
                      {Array.isArray(course.lessons) && course.lessons.length > 0 && (
                        <div className="w-full">
                          <div className="relative" style={{ paddingTop: "56.25%" }}>
                            <iframe
                              title={`${course.title} - Lesson ${selectedLessonIndex + 1}`}
                              src={toEmbedUrl(course.lessons[selectedLessonIndex]?.url)}
                              className="absolute inset-0 w-full h-full rounded-md"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {Array.isArray(course.lessons) && course.lessons.map((lesson: any, idx: number) => (
                        <li key={idx}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLessonIndex(idx)
                            }}
                            className={`text-left w-full px-2 py-1 rounded ${idx === selectedLessonIndex ? 'bg-blue-600 text-white' : 'text-blue-400 hover:underline'}`}
                          >
                            {idx + 1}. {lesson.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
