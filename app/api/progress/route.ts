import { NextRequest, NextResponse } from 'next/server'

// Simple progress endpoint - this implementation does not persist data permanently.
// It accepts POST requests with { courseId, completed: [lessonIds], source?: 'client' }
// and responds with success. This is a shim you can replace with real persistence later.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('Progress POST received:', body)
        // TODO: persist to DB for authenticated users
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Progress POST error', err)
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }
}

export async function GET() {
    // No-op: there's no server-side storage in this shim.
    return NextResponse.json({ success: true, message: 'Progress API is a shim; implement persistence to enable server sync.' })
}
