"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import courses from '@/lib/courses'

type Enrollment = {
  id: string
  userId: string
  courseId: number
  enrolledAt: string
  progress: number
  completedVideos: number[]
}

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

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-black font-bold text-xl">{profileName ? profileName.charAt(0) : 'S'}</div>
            <div>
              <h2 className="text-2xl font-semibold">{profileName || 'Student'}</h2>
              <p className="text-sm text-gray-400">{userId ? `ID: ${userId}` : 'No student selected'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className="text-sm text-gray-400">Overall progress</div>
              <div className="text-lg font-medium text-white">{enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / Math.max(1, enrollments.length)) : 0}%</div>
            </div>
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center" style={{ background: `conic-gradient(#10b981 ${enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / Math.max(1, enrollments.length)) : 0}%, rgba(255,255,255,0.06) 0)` }}>
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-sm font-semibold">{enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / Math.max(1, enrollments.length)) : 0}%</div>
            </div>
            <div>
              {userId ? <Button onClick={logout}>Sign out</Button> : (
                <div className="flex gap-2">
                  <Button onClick={() => setAsCurrentUser('student_1', 'Esi Micah')}>Esi</Button>
                  <Button onClick={() => setAsCurrentUser('student_2', 'Stephanie')}>Stephanie</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-3">Your Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent>Loading enrollments…</CardContent>
                </Card>
              ) : enrollments.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent>No enrollments found — enroll in a course to get started.</CardContent>
                </Card>
              ) : (
                enrollments.map((enr) => {
                  const course = courses.find((c) => c.id === enr.courseId)
                  const localProgressRaw = globalThis?.localStorage?.getItem ? localStorage.getItem(`course-progress-${enr.courseId}`) : null
                  let localCompletedCount = 0
                  try {
                    const parsed = localProgressRaw ? JSON.parse(localProgressRaw) : []
                    if (Array.isArray(parsed)) localCompletedCount = parsed.length
                  } catch (e) { }

                  return (
                    <Card key={enr.id} className="bg-slate-900/60 border-transparent hover:scale-[1.01] transition-transform">
                      <CardContent>
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-semibold">{(course?.title || '').split(' ').slice(0, 2).map(s => s[0] || '').join('')}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-white">{course?.title || `Course ${enr.courseId}`}</div>
                                <div className="text-xs text-gray-400">{course?.mentor || 'Mentor'}</div>
                              </div>
                              <div className="text-sm text-gray-300">{enr.progress}%</div>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${enr.progress}%` }} />
                            </div>
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                              <span>{localCompletedCount}/{course?.lessons?.length || 0} lessons done</span>
                              <div className="flex gap-2">
                                <Link href={`/course/${enr.courseId}`} className="px-3 py-1 bg-white text-black rounded text-sm">Continue</Link>
                                <Button variant="outline" onClick={() => { window.localStorage.removeItem(`course-progress-${enr.courseId}`); }}>Clear</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>

          <aside>
            <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
                <div className="text-sm text-gray-300">You completed <span className="text-white font-medium">Lesson 3</span> in <span className="text-white">Digital Marketing</span></div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
                <div className="text-sm text-gray-300">You enrolled in <span className="text-white font-medium">Figma Design</span></div>
                <div className="text-xs text-gray-500">Yesterday</div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded border border-slate-700">
                <div className="text-sm text-gray-300">New lesson added to <span className="text-white font-medium">UI/UX Design</span></div>
                <div className="text-xs text-gray-500">3 days ago</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
