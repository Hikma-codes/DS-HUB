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

        <h1 className="text-4xl font-bold mb-6">Student Dashboard</h1>

        {!userId ? (
          <Card className="mb-6 bg-slate-900/50 border-slate-700">
            <CardContent>
              <p className="text-gray-300 mb-2">No student selected. Set a local demo user to view the student dashboard.</p>
              <div className="flex gap-2">
                <Button onClick={() => setAsCurrentUser('student_1', 'Esi Micah')}>Use demo student: Esi</Button>
                <Button onClick={() => setAsCurrentUser('student_2', 'Stephanie')}>Use demo student: Stephanie</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{profileName}'s Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Student ID</p>
                    <p className="text-white font-medium">{userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Enrollments</p>
                    <p className="text-white font-medium">{enrollments.length}</p>
                  </div>
                  <div>
                    <Button onClick={logout}>Sign out</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent>Loading enrollments…</CardContent>
                </Card>
              ) : enrollments.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent>No enrollments found for this student.</CardContent>
                </Card>
              ) : (
                enrollments.map((enr) => {
                  const course = courses.find((c) => c.id === enr.courseId)
                  const localProgressRaw = localStorage.getItem(`course-progress-${enr.courseId}`)
                  let localCompletedCount = 0
                  try {
                    const parsed = localProgressRaw ? JSON.parse(localProgressRaw) : []
                    if (Array.isArray(parsed)) localCompletedCount = parsed.length
                  } catch (e) { }

                  return (
                    <Card key={enr.id} className="bg-slate-900/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">{course?.title || `Course ${enr.courseId}`}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 mb-2">Mentor: {course?.mentor || 'TBA'}</p>
                        <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${enr.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>Server progress: <span className="text-white">{enr.progress}%</span></span>
                          <span>Local lessons done: <span className="text-white">{localCompletedCount}/{course?.lessons?.length || 0}</span></span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link href={`/course/${enr.courseId}`} className="px-3 py-1 bg-white text-black rounded text-sm">Open Course</Link>
                          <Button onClick={() => window.localStorage.removeItem(`course-progress-${enr.courseId}`)}>Clear Local Progress</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
