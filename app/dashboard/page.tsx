"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, BookOpen, TrendingUp } from 'lucide-react'

const dashboardData = {
  totalUsers: 15,
  totalEnrollments: 31,
  activeCourses: 3,
  completionRate: 45,
  courseStats: [
    {
      name: "Digital Marketing Fundamentals",
      enrolled: 12,
      active: 10,
      completed: 5,
      progress: 58
    },
    {
      name: "Figma Design Essentials",
      enrolled: 8,
      active: 7,
      completed: 3,
      progress: 42
    },
    {
      name: "UI/UX Design Fundamentals",
      enrolled: 11,
      active: 9,
      completed: 4,
      progress: 36
    },
  ],
  recentActivity: [
    { user: "Esi Micah", action: "Enrolled in Digital Marketing", time: "2 hours ago" },
    { user: "Stephanie Danso", action: "Completed Figma Design Lesson 5", time: "4 hours ago" },
    { user: "Cecil Essel", action: "Started UI/UX Design course", time: "1 day ago" },
    { user: "Christabel Amofa", action: "Completed Digital Marketing course", time: "2 days ago" },
    { user: "Emmanuel Amofa", action: "Enrolled in Figma Design", time: "6 hours ago" },
  ]
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.totalUsers}</p>
                </div>
                <Users size={32} className="text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Enrollments</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.totalEnrollments}</p>
                </div>
                <BookOpen size={32} className="text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Courses</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.activeCourses}</p>
                </div>
                <TrendingUp size={32} className="text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Completion</p>
                  <p className="text-3xl font-bold text-white">{dashboardData.completionRate}%</p>
                </div>
                <TrendingUp size={32} className="text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Statistics */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData.courseStats.map((course, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{course.name}</h3>
                    <span className="text-sm text-gray-400">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>Enrolled: <span className="text-white">{course.enrolled}</span></span>
                    <span>Active: <span className="text-white">{course.active}</span></span>
                    <span>Completed: <span className="text-white">{course.completed}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start justify-between pb-3 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
