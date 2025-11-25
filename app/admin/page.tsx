"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Settings, AlertCircle, CheckCircle } from 'lucide-react'

const adminData = {
  admin: {
    name: "Hikma Hamza",
    email: "hamzahikma9@gmail.com",
    phone: "+250794414171",
    role: "Platform Founder & Admin"
  },
  users: [
    { id: 1, name: "Esi Micah", email: "e.micah@gmail.com", courses: 2, status: "active" },
    { id: 2, name: "Stephanie Danso", email: "s.danso@gmail.com", courses: 1, status: "active" },
    { id: 3, name: "Cecil Essel", email: "c.essel@gmail.com", courses: 1, status: "active" },
    { id: 4, name: "Sedoh Julius", email: "s.julius@gmail.com", courses: 3, status: "completed" },
    { id: 5, name: "Emmanuel Ansah", email: "e.ansah@gmail.com", courses: 1, status: "completed" },
    { id: 6, name: "Portia Munku", email: "p.munku@gmail.com", courses: 2, status: "active" },
    { id: 7, name: "Christabel Amofa", email: "c.amofa@gmail.com", courses: 2, status: "active" },
    { id: 8, name: "Emmanuel Amofa", email: "e.amofa@gmai.com", courses: 1, status: "active" },
    { id: 9, name: "Esther Kpeglo", email: "e.kpeglo@gmail.com", courses: 2, status: "active" },
    { id: 10, name: "Khadijah Wiafe", email: "k.wiafe@gmail.com", courses: 3, status: "completed" },
    { id: 11, name: "Isabella Biney", email: "i.biney@gmail.com", courses: 1, status: "active" },
    { id: 12, name: "Nsobila Godfred", email: "n.godfred@gmail.com", courses: 2, status: "active" },
    { id: 13, name: "Raphael Anaba", email: "r.anaba@gmail.com", courses: 1, status: "active" },
    { id: 14, name: "Daniella Sackey", email: "d.sackey@gmail.com", courses: 2, status: "active" },
    { id: 15, name: "Juwell Amankwah", email: "j.amankwah.com", courses: 1, status: "active" },
  ],
  mentors: [
    { id: 1, name: "Marcus Johnson", expertise: "Digital Marketing", students: 35 },
    { id: 2, name: "Sarah Chen", expertise: "Figma Design", students: 28 },
    { id: 3, name: "Elena Rodriguez", expertise: "UI/UX Design", students: 31 },
  ]
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Admin Info */}
        <Card className="bg-purple-900/20 border-purple-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings size={24} />
              Platform Administrator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                <Badge className="bg-purple-600">{adminData.admin.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentors List */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.mentors.map((mentor) => (
                  <div key={mentor.id} className="pb-4 border-b border-slate-700 last:border-0">
                    <h3 className="text-white font-medium">{mentor.name}</h3>
                    <p className="text-sm text-blue-400">{mentor.expertise}</p>
                    <p className="text-xs text-gray-400 mt-1">{mentor.students} students</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Enrolled Users ({adminData.users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {adminData.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{user.courses} courses</span>
                        {user.status === "completed" ? (
                          <Badge className="bg-green-900/30 text-green-300 text-xs">Completed</Badge>
                        ) : (
                          <Badge className="bg-blue-900/30 text-blue-300 text-xs">Active</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
