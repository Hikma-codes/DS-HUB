import { NextRequest, NextResponse } from 'next/server'
import { createSession, deleteSession } from '@/lib/authMiddleware'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, name } = body || {}
        if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 })
        const token = createSession(userId)
        const res = NextResponse.json({ success: true, token, name })
        res.cookies.set('session', token, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
        return res
    } catch (err) {
        console.error('Session POST', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get('session')?.value
        if (token) deleteSession(token)
        const res = NextResponse.json({ success: true })
        res.cookies.set('session', '', { path: '/', httpOnly: true, maxAge: 0 })
        return res
    } catch (err) {
        console.error('Session DELETE', err)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}
