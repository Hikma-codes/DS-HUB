"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Users } from 'lucide-react'

const adminData = {
  admin: {
    name: "Hikma Hamza",
    email: "hamzahikma9@gmail.com",
    phone: "+250794414171",
    role: "Platform Founder & Admin"
  },
  users: [
    { id: 1, name: "Esi Micah", email: "e.micah@gmail.com", courses: 2, progress: 40, status: "active" },
    { id: 2, name: "Stephanie Danso", email: "s.danso@gmail.com", courses: 1, progress: 100, status: "completed" },
    { id: 3, name: "Cecil Essel", email: "c.essel@gmail.com", courses: 1, progress: 50, status: "active" },
    { id: 4, name: "Sedoh Julius", email: "s.julius@gmail.com", courses: 3, progress: 100, status: "completed" },
    { id: 5, name: "Emmanuel Ansah", email: "e.ansah@gmail.com", courses: 1, progress: 100, status: "completed" },
    { id: 6, name: "Portia Munku", email: "p.munku@gmail.com", courses: 2, progress: 60, status: "active" },
    { id: 7, name: "Christabel Amofa", email: "c.amofa@gmail.com", courses: 2, progress: 100, status: "completed" },
    { id: 8, name: "Emmanuel Amofa", email: "e.amofa@gmai.com", courses: 1, progress: 30, status: "active" },
    { id: 9, name: "Esther Kpeglo", email: "e.kpeglo@gmail.com", courses: 2, progress: 50, status: "active" },
    { id: 10, name: "Khadijah Wiafe", email: "k.wiafe@gmail.com", courses: 3, progress: 100, status: "completed" },
    { id: 11, name: "Isabella Biney", email: "i.biney@gmail.com", courses: 1, progress: 20, status: "active" },
    { id: 12, name: "Nsobila Godfred", email: "n.godfred@gmail.com", courses: 2, progress: 70, status: "active" },
    { id: 13, name: "Raphael Anaba", email: "r.anaba@gmail.com", courses: 1, progress: 50, status: "active" },
    { id: 14, name: "Daniella Sackey", email: "d.sackey@gmail.com", courses: 2, progress: 60, status: "active" },
    { id: 15, name: "Juwell Amankwah", email: "j.amankwah.com", courses: 1, progress: 100, status: "completed" },
  ],
  mentors: [
    { id: 1, name: "Marcus Johnson", expertise: "Digital Marketing", students: 12 },
    { id: 2, name: "Sarah Chen", expertise: "Figma Design", students: 10 },
    { id: 3, name: "Elena Rodriguez", expertise: "UI/UX Design", students: 13 },
  ]
}

export default function AdminPage() {
  // Calculate quick stats
  const totalUsers = adminData.users.length
  const activeUsers = adminData.users.filter(u => u.status === "active").length
  const completedUsers = adminData.users.filter(u => u.status === "completed").length

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Admin Info */}
        <Card className="bg-[#F5A300]/20 border-[#F5A300]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings size={24} />
              Platform Administrator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-medium">{adminData.admin.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-blue-400">{adminData.admin.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-white">{adminData.admin.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <Badge className="bg-[#F5A300] text-black">{adminData.admin.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-700 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-white text-2xl font-bold">{totalUsers}</p>
            </div>
            <Users size={40} className="text-blue-400" />
          </Card>
          <Card className="bg-slate-900/50 border-slate-700 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-white text-2xl font-bold">{activeUsers}</p>
            </div>
            <Users size={40} className="text-green-400" />
          </Card>
          <Card className="bg-slate-900/50 border-slate-700 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Users</p>
              <p className="text-white text-2xl font-bold">{completedUsers}</p>
            </div>
            <Users size={40} className="text-yellow-400" />
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">User Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-gray-400">Name</th>
                    <th className="px-4 py-2 text-gray-400">Email</th>
                    <th className="px-4 py-2 text-gray-400">Courses Enrolled</th>
                    <th className="px-4 py-2 text-gray-400">Progress</th>
                    <th className="px-4 py-2 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-slate-800/30 transition">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2 text-blue-400">{user.email}</td>
                      <td className="px-4 py-2">{user.courses}</td>
                      <td className="px-4 py-2">
                        <div className="bg-gray-700/40 rounded h-2 w-full">
                          <div
                            className="bg-green-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{user.progress}%</p>
                      </td>
                      <td className="px-4 py-2">
                        {user.status === "completed" ? (
                          <Badge className="bg-green-900/30 text-green-300 text-xs">Completed</Badge>
                        ) : (
                          <Badge className="bg-blue-900/30 text-blue-300 text-xs">Active</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mentors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminData.mentors.map((mentor) => (
            <Card key={mentor.id} className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{mentor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">Expertise</p>
                <p className="text-blue-400">{mentor.expertise}</p>
                <p className="text-gray-400 text-xs mt-1">{mentor.students} students</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
