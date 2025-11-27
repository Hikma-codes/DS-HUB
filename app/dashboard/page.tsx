"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import courses from "@/lib/courses";

type Enrollment = {
  id: string;
  userId: string;
  courseId: number;
  enrolledAt: string;
  progress: number;
  completedVideos: number[];
};

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>("student_1");
  const [profileName, setProfileName] = useState<string | null>("Esi Micah");
  const [profileImage] = useState<string>(
    "https://i.ibb.co/qNcyyJv/woman-avatar.jpg" // sample avatar
  );
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  const GOLD = "#F5A300";

  useEffect(() => {
    setLoading(true);

    // DEFAULT: User already enrolled in 2 courses
    const defaultEnrollments: Enrollment[] = [
      {
        id: "enr1",
        userId: "student_1",
        courseId: 1, // Figma
        enrolledAt: "2025-01-10",
        progress: 45,
        completedVideos: [1, 2, 3],
      },
      {
        id: "enr2",
        userId: "student_1",
        courseId: 2, // Digital Marketing
        enrolledAt: "2025-01-12",
        progress: 78,
        completedVideos: [1, 2, 3, 4, 5],
      },
    ];

    setTimeout(() => {
      setEnrollments(defaultEnrollments);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Top Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2"
              style={{ borderColor: GOLD }}
            />

            <div>
              <h2 className="text-2xl font-semibold">{profileName}</h2>
              <p className="text-sm text-gray-400">ID: {userId}</p>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Overall Progress</p>
              <p className="text-xl font-bold">
                {Math.round(
                  enrollments.reduce((s, e) => s + e.progress, 0) /
                  enrollments.length
                )}
                %
              </p>
            </div>

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${GOLD} ${enrollments.length
                    ? Math.round(
                      enrollments.reduce((s, e) => s + e.progress, 0) /
                      enrollments.length
                    )
                    : 0
                  }%, rgba(255,255,255,0.1) 0)`,
              }}
            >
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-sm font-semibold">
                {Math.round(
                  enrollments.reduce((s, e) => s + e.progress, 0) /
                  enrollments.length
                )}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card className="bg-[#111] border border-[#222]">
            <CardContent className="p-6">
              <h4 className="text-gray-400 text-sm mb-1">Enrolled Courses</h4>
              <p className="text-3xl font-bold">{enrollments.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border border-[#222]">
            <CardContent className="p-6">
              <h4 className="text-gray-400 text-sm mb-1">Completed Lessons</h4>
              <p className="text-3xl font-bold">
                {enrollments.reduce(
                  (s, e) => s + e.completedVideos.length,
                  0
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border border-[#222]">
            <CardContent className="p-6">
              <h4 className="text-gray-400 text-sm mb-1">Avg Progress</h4>
              <p className="text-3xl font-bold text-yellow-400">
                {Math.round(
                  enrollments.reduce((s, e) => s + e.progress, 0) /
                  enrollments.length
                )}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <h3 className="text-xl font-semibold mb-3">Your Courses</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {enrollments.map((enr) => {
            const course = courses.find((c) => c.id === enr.courseId);

            return (
              <Card key={enr.id} className="bg-[#111] border border-[#222] hover:border-yellow-500 transition">
                <CardContent className="p-5">
                  <h4 className="text-lg font-semibold">{course?.title}</h4>
                  <p className="text-xs text-gray-400 mb-3">{course?.mentor}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${enr.progress}%`,
                        backgroundColor: GOLD,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{enr.progress}% Complete</span>

                    <Link
                      href={`/course/${enr.courseId}`}
                      className="px-3 py-1 bg-yellow-400 text-black text-xs rounded font-semibold"
                    >
                      Continue
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Section */}
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

        <div className="space-y-3">
          <div className="p-3 bg-[#111] border border-[#222] rounded">
            <p className="text-sm">
              You completed <span className="text-yellow-400">Lesson 3</span> in
              Digital Marketing.
            </p>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>

          <div className="p-3 bg-[#111] border border-[#222] rounded">
            <p className="text-sm">
              You enrolled in{" "}
              <span className="text-yellow-400">Figma Design</span>.
            </p>
            <p className="text-xs text-gray-400">Yesterday</p>
          </div>

          <div className="p-3 bg-[#111] border border-[#222] rounded">
            <p className="text-sm">
              New lesson added to{" "}
              <span className="text-yellow-400">UI/UX Design</span>.
            </p>
            <p className="text-xs text-gray-400">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
