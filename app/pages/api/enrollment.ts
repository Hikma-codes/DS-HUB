// Simple server-backed enrollment API using lib/dbStore and optional auth
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth } from '@/lib/authMiddleware'
import * as db from '@/lib/dbStore'

const enrollSchema = z.object({ userId: z.string().optional(), courseId: z.number().int().positive() })

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const parsed = enrollSchema.safeParse(body)
        if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid body', details: parsed.error.errors }, { status: 400 })

        const authUser = await verifyAuth(request)
        const userId = authUser ? authUser.id : parsed.data.userId
        if (!userId) return NextResponse.json({ success: false, error: 'User ID required (or sign in)' }, { status: 400 })

        const courseId = parsed.data.courseId
        const existing = await db.findEnrollment(userId, courseId)
        if (existing) return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 })

        const created = await db.createEnrollment({ userId, courseId, progress: 0, completedVideos: [] })
        return NextResponse.json({ success: true, enrollment: created }, { status: 201 })
    } catch (err) {
        console.error('Enrollment POST error', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const authUser = await verifyAuth(request)
        const userId = authUser ? authUser.id : url.searchParams.get('userId')
        if (!userId) return NextResponse.json({ success: false, error: 'userId required or sign in' }, { status: 400 })

        const enrollments = await db.getEnrollmentsByUser(userId)
        return NextResponse.json({ success: true, enrollments, total: enrollments.length })
    } catch (err) {
        console.error('Enrollment GET error', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { enrollmentId, videoId, progress } = body
        if (!enrollmentId) return NextResponse.json({ success: false, error: 'enrollmentId required' }, { status: 400 })

        const updated = await db.updateEnrollmentProgress(enrollmentId, { progress, addVideoId: videoId })
        if (!updated) return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 })
        return NextResponse.json({ success: true, enrollment: updated })
    } catch (err) {
        console.error('Enrollment PUT error', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}