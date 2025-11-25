// lib/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Types
export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    role: 'student' | 'mentor' | 'admin';
}

// In-memory session storage (replace with Redis/database in production)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

/**
 * Verify session token and return user data
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        // Get token from cookie or Authorization header
        const token = request.cookies.get('session')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return null;
        }

        // Check if session exists and is valid
        const session = sessions.get(token);
        if (!session || session.expiresAt < Date.now()) {
            // Session expired or doesn't exist
            if (session) {
                sessions.delete(token);
            }
            return null;
        }

        // In production, fetch user from database
        // For now, return mock user data
        const user: AuthUser = {
            id: session.userId,
            email: 'user@example.com',
            fullName: 'Test User',
            role: 'student'
        };

        return user;
    } catch (error) {
        console.error('Auth verification error:', error);
        return null;
    }
}

/**
 * Create a new session
 */
export function createSession(userId: string): string {
    const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    sessions.set(token, { userId, expiresAt });
    return token;
}

/**
 * Delete a session (logout)
 */
export function deleteSession(token: string): void {
    sessions.delete(token);
}

/**
 * Middleware wrapper for protected routes
 */
export function withAuth(
    handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        return handler(request, user);
    };
}

/**
 * Middleware wrapper for admin-only routes
 */
export function withAdminAuth(
    handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        if (user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Forbidden. Admin access required.' },
                { status: 403 }
            );
        }

        return handler(request, user);
    };
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
    return async (request: NextRequest) => {
        const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        const rateLimitData = rateLimitMap.get(ip);

        if (!rateLimitData || rateLimitData.resetAt < now) {
            // New window or expired
            rateLimitMap.set(ip, {
                count: 1,
                resetAt: now + windowMs
            });
            return null; // Allow request
        }

        if (rateLimitData.count >= maxRequests) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((rateLimitData.resetAt - now) / 1000)
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil((rateLimitData.resetAt - now) / 1000))
                    }
                }
            );
        }

        // Increment count
        rateLimitData.count++;
        return null; // Allow request
    };
}

/**
 * CORS middleware
 */
export function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}