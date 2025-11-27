"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Mail, Phone } from 'lucide-react'

const mentors = [
  {
    name: "Sarah Chen",
    expertise: "Figma Design",
    students: 10,
    certifications: "Figma Design Specialist",
    email: "s.chen@digitalskillshub.com",
    phone: "+1-555-0101"
  },
  {
    name: "Marcus Johnson",
    expertise: "Digital Marketing",
    students: 12,
    certifications: "Certified Digital Marketing Expert",
    email: "marcus.j@digitalskillshub.com",
    phone: "+1-555-0102"
  },
  {
    name: "Elena Rodriguez",
    expertise: "UI/UX Design",
    students: 13,
    certifications: "UI/UX Specialist",
    email: "elena.r@digitalskillshub.com",
    phone: "+1-555-0103"
  },
]

const admins = [
  {
    name: "Hikma Hamza",
    role: "Platform Founder & Instructor",
    email: "hamzahikma9@gmail.com",
    phone: "+250794414171"
  },
]

export function MentorsSection() {
  return (
    <section id="mentors" className="min-h-screen py-20 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Your Mentor</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn directly from an experienced professional dedicated to your success
          </p>
        </div>

        {/* Admin Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Badge className="bg-[#F5A300] text-black">FOUNDER</Badge>

            Platform Leadership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {admins.map((admin, idx) => (
              <Card
                key={idx}
                className="bg-[#F5A300]/10 border-[#F5A300] hover:border-[#F5A300]/70 transition-all"
              >

                <CardHeader>
                  <CardTitle className="text-white">{admin.name}</CardTitle>
                  <p className="text-sm text-gray-300">{admin.role}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Mail size={16} className="text-blue-400" />
                    <a href={`mailto:${admin.email}`} className="hover:text-blue-400 transition-colors">{admin.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone size={16} className="text-blue-400" />
                    <a href={`tel:${admin.phone}`} className="hover:text-blue-400 transition-colors">{admin.phone}</a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mentors Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Badge className="bg-blue-600">MENTOR</Badge>
            Mentors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, idx) => (
              <Card key={idx} className="bg-slate-900/50 border-slate-700 hover:border-blue-500 transition-all">
                <CardHeader>
                  <CardTitle className="text-white">{mentor.name}</CardTitle>
                  <p className="text-sm text-blue-400 font-medium">{mentor.expertise}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-blue-400">👥</span>
                    <span>{mentor.students} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Award size={16} className="text-yellow-400" />
                    <span className="text-xs">{mentor.certifications}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-4">
                    <Mail size={16} className="text-blue-400" />
                    <a href={`mailto:${mentor.email}`} className="hover:text-blue-400 transition-colors text-xs">{mentor.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone size={16} className="text-blue-400" />
                    <a href={`tel:${mentor.phone}`} className="hover:text-blue-400 transition-colors text-xs">{mentor.phone}</a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
