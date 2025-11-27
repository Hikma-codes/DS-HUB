"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import courses from '@/lib/courses'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts"

type Enrollment = {
  id: string
  userId: string
  courseId: number
  enrolledAt: string
  progress: number
  completedVideos: number[]
}

const GOLD = "#FFB700"
const DARK_CARD = "bg-slate-900/60 border-slate-700"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        const obj = JSON.parse(stored)
        setUserId(String(obj.id || obj.userId || obj.email || 'guest'))
        setProfileName(String(obj.name || obj.email || 'Student'))
      } catch (e) {
        setUserId(stored)
        setProfileName('Student')
      }
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`/api/enrollment?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.enrollments) setEnrollments(data.enrollments)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [userId])

  const setAsCurrentUser = async (id: string, name?: string) => {
    try {
      await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id, name }) })
      setUserId(id)
      setProfileName(name || 'Student')
      setLoading(true)
      const res = await fetch(`/api/enrollment?userId=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (data && data.enrollments) setEnrollments(data.enrollments)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      setUserId(null)
      setProfileName(null)
      localStorage.removeItem('currentUser')
      setEnrollments([])
    } catch (e) { }
  }

  // Derived stats
  const overallProgress = useMemo(() => {
    if (!enrollments.length) return 0
    const sum = enrollments.reduce((s, e) => s + (e.progress || 0), 0)
    return Math.round(sum / enrollments.length)
  }, [enrollments])

  const totalLessons = useMemo(() => {
    return enrollments.reduce((sum, e) => {
      const c = courses.find(c => c.id === e.courseId)
      return sum + (c?.lessons?.length || 0)
    }, 0)
  }, [enrollments])

  const completedLessons = useMemo(() => {
    return enrollments.reduce((sum, e) => sum + (e.completedVideos?.length || 0), 0)
  }, [enrollments])

  // Sample chart data: progress over last 6 sessions (mock or derived)
  const progressOverTime = useMemo(() => {
    // If enrollments include timestamps you can map them; otherwise mock by course progress buckets
    if (enrollments.length === 0) {
      return [
        { name: "Week 1", value: 5 },
        { name: "Week 2", value: 12 },
        { name: "Week 3", value: 20 },
        { name: "Week 4", value: 35 },
        { name: "Week 5", value: 50 },
        { name: "This week", value: overallProgress },
      ]
    }
    // build average progress snapshots (simple)
    return [
      { name: "Week 1", value: Math.max(2, overallProgress - 30) },
      { name: "Week 2", value: Math.max(5, overallProgress - 20) },
      { name: "Week 3", value: Math.max(10, overallProgress - 10) },
      { name: "Week 4", value: Math.max(20, overallProgress - 5) },
      { name: "Week 5", value: Math.max(30, overallProgress - 2) },
      { name: "This week", value: overallProgress },
    ]
  }, [enrollments, overallProgress])

  const courseBreakdown = useMemo(() => {
    return enrollments.map(e => {
      const c = courses.find(s => s.id === e.courseId)
      return {
        name: c?.title || `Course ${e.courseId}`,
        progress: e.progress || 0,
      }
    })
  }, [enrollments])

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft size={20} />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4 hidden sm:block">
              <div className="text-xs text-gray-400">Overall progress</div>
              <div className="text-xl font-semibold text-white">{overallProgress}%</div>
            </div>

            <div className="flex items-center gap-3">
              <div
                aria-hidden
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${GOLD} ${overallProgress}%, rgba(255,255,255,0.04) 0)`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-sm font-semibold border border-slate-800">
                  {overallProgress}%
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Student</div>
                <div className="text-lg font-bold">{profileName || "Student"}</div>
                <div className="text-xs text-gray-500">{userId ? `ID: ${userId}` : 'No student selected'}</div>
              </div>

              <div className="ml-4">
                {userId ? <Button onClick={logout} className="bg-transparent border border-slate-700 hover:bg-slate-800">Sign out</Button> : (
                  <div className="flex gap-2">
                    <Button onClick={() => setAsCurrentUser('student_1', 'Esi Micah')}>Esi</Button>
                    <Button onClick={() => setAsCurrentUser('student_2', 'Stephanie')}>Stephanie</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className={`${DARK_CARD} p-4`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Courses Enrolled</div>
                  <div className="text-2xl font-bold">{enrollments.length}</div>
                </div>
                <div className="text-3xl" style={{ color: GOLD }}>🎓</div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DARK_CARD} p-4`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Lessons Completed</div>
                  <div className="text-2xl font-bold">{completedLessons}</div>
                </div>
                <div className="text-3xl" style={{ color: GOLD }}>✅</div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DARK_CARD} p-4`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Total Lessons</div>
                  <div className="text-2xl font-bold">{totalLessons}</div>
                </div>
                <div className="text-3xl" style={{ color: GOLD }}>📚</div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${DARK_CARD} p-4`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Certificates</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
                <div className="text-3xl" style={{ color: GOLD }}>🏅</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Courses + Progress */}
          <div className="lg:col-span-2 space-y-4">
            <Card className={`${DARK_CARD}`}>
              <CardHeader className="px-4 py-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Learning Progress</span>
                  <span className="text-sm text-gray-400">Tracked across your courses</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading ? (
                    <div className="p-6 text-sm text-gray-400">Loading enrollments…</div>
                  ) : enrollments.length === 0 ? (
                    <div className="p-6 text-sm text-gray-400">No enrollments found — enroll in a course to get started.</div>
                  ) : enrollments.map((enr) => {
                    const course = courses.find((c) => c.id === enr.courseId)
                    const localProgressRaw = globalThis?.localStorage?.getItem ? localStorage.getItem(`course-progress-${enr.courseId}`) : null
                    let localCompletedCount = 0
                    try {
                      const parsed = localProgressRaw ? JSON.parse(localProgressRaw) : []
                      if (Array.isArray(parsed)) localCompletedCount = parsed.length
                    } catch (e) { }

                    return (
                      <div key={enr.id} className="flex gap-3 items-start p-3 rounded border border-slate-800">
                        <div className="w-14 h-14 rounded-md flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD}, #d18f00)` }}>
                          <div className="text-black font-semibold">{(course?.title || '').split(' ').slice(0, 2).map(s => s[0] || '').join('')}</div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{course?.title || `Course ${enr.courseId}`}</div>
                              <div className="text-xs text-gray-400">{course?.mentor || 'Mentor'}</div>
                            </div>
                            <div className="text-sm text-gray-300">{enr.progress}%</div>
                          </div>

                          {/* progress bar */}
                          <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                            <div className="h-2 rounded-full" style={{ width: `${enr.progress}%`, background: `linear-gradient(90deg, ${GOLD}, #e6b400)` }} />
                          </div>

                          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                            <span>{localCompletedCount}/{course?.lessons?.length || 0} lessons</span>
                            <div className="flex gap-2 items-center">
                              <Link href={`/course/${enr.courseId}`} className="px-3 py-1 bg-black text-white rounded text-sm border border-slate-700">Continue</Link>
                              <Button variant="outline" onClick={() => { window.localStorage.removeItem(`course-progress-${enr.courseId}`); }}>Clear</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`${DARK_CARD} p-4`}>
                <div className="text-sm text-gray-400 mb-2">Progress Over Time</div>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <LineChart data={progressOverTime}>
                      <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ background: "#0b1220", borderRadius: 6 }} />
                      <Line type="monotone" dataKey="value" stroke={GOLD} strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className={`${DARK_CARD} p-4`}>
                <div className="text-sm text-gray-400 mb-2">Course Breakdown</div>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={courseBreakdown}>
                      <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ background: "#0b1220", borderRadius: 6 }} />
                      <Bar dataKey="progress" fill={GOLD} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Activity + Quick stats */}
          <aside className="space-y-4">
            <Card className={`${DARK_CARD} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-400">Recent Activity</div>
                </div>
                <div className="text-xs text-gray-500">Today</div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded bg-slate-900/30 border border-slate-800">
                  <div className="text-sm text-gray-300">You completed <span className="text-white font-medium">Lesson 3</span> in <span className="text-white">Digital Marketing</span></div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>

                <div className="p-3 rounded bg-slate-900/30 border border-slate-800">
                  <div className="text-sm text-gray-300">You enrolled in <span className="text-white font-medium">Figma Design</span></div>
                  <div className="text-xs text-gray-500">Yesterday</div>
                </div>

                <div className="p-3 rounded bg-slate-900/30 border border-slate-800">
                  <div className="text-sm text-gray-300">New lesson added to <span className="text-white font-medium">UI/UX Design</span></div>
                  <div className="text-xs text-gray-500">3 days ago</div>
                </div>
              </div>
            </Card>

            <Card className={`${DARK_CARD} p-4`}>
              <div className="text-sm text-gray-400 mb-2">Quick Actions</div>
              <div className="flex flex-col gap-2">
                <Link href="/courses" className="px-3 py-2 rounded border border-slate-700 text-sm text-white text-center" style={{ background: "transparent" }}>Browse Courses</Link>
                <Link href="/profile" className="px-3 py-2 rounded border border-slate-700 text-sm text-white text-center" style={{ background: GOLD, color: "black" }}>View Profile</Link>
                <Button onClick={() => alert('Exported progress (mock)')} className="bg-transparent border border-slate-700">Export Progress</Button>
              </div>
            </Card>

            <Card className={`${DARK_CARD} p-4`}>
              <div className="text-sm text-gray-400">Tips</div>
              <div className="text-xs text-gray-500 mt-2">Keep a daily study streak — 15 minutes each day builds momentum. Try completing one lesson from each course per week.</div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
