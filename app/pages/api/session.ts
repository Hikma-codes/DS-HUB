import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession, verifyAuth } from '@/lib/authMiddleware',

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, name } = body || {}
        if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 })

        const token = createSession(userId)

        const res = NextResponse.json({ success: true, token, name })
        // set cookie for session (HttpOnly)
        res.cookies.set('session', token, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
        return res
    } catch (err) {
        console.error('Session POST error', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        const token = request.cookies.get('session')?.value
        if (!token) return NextResponse.json({ success: true })
        deleteSession(token)
        const res = NextResponse.json({ success: true })
        res.cookies.set('session', '', { path: '/', httpOnly: true, maxAge: 0 })
        return res
    } catch (err) {
        console.error('Session DELETE error', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}
