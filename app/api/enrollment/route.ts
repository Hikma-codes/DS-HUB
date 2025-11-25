import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/lib/dbStore'
import { verifyAuth } from '@/lib/authMiddleware'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId: bodyUserId, courseId } = body || {}
        const authUser = await verifyAuth(req)
        const userId = authUser ? authUser.id : bodyUserId
        if (!userId || !courseId) return NextResponse.json({ success: false, error: 'userId and courseId required' }, { status: 400 })

        const existing = await db.findEnrollment(userId, courseId)
        if (existing) return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 })

        const created = await db.createEnrollment({ userId, courseId, progress: 0, completedVideos: [] })
        return NextResponse.json({ success: true, enrollment: created }, { status: 201 })
    } catch (err) {
        console.error('Enrollment POST', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const authUser = await verifyAuth(req)
        const userId = authUser ? authUser.id : url.searchParams.get('userId')
        if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 })
        const enrollments = await db.getEnrollmentsByUser(userId)
        return NextResponse.json({ success: true, enrollments, total: enrollments.length })
    } catch (err) {
        console.error('Enrollment GET', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const { enrollmentId, videoId, progress } = body || {}
        if (!enrollmentId) return NextResponse.json({ success: false, error: 'enrollmentId required' }, { status: 400 })
        const updated = await db.updateEnrollmentProgress(enrollmentId, { progress, addVideoId: videoId })
        if (!updated) return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 })
        return NextResponse.json({ success: true, enrollment: updated })
    } catch (err) {
        console.error('Enrollment PUT', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}
