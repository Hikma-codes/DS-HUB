// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// In-memory user storage (replace with database in production)
let users: Array<{
    id: string;
    fullName: string;
    email: string;
    password: string;
    createdAt: string;
    enrolledCourses: number[];
}> = [];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = signupSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { fullName, email, password } = validationResult.data;

        // Check if user already exists
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User with this email already exists'
                },
                { status: 409 }
            );
        }

        // Create new user (in production, hash the password!)
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fullName,
            email: email.toLowerCase(),
            password, // In production: await hash(password, 10)
            createdAt: new Date().toISOString(),
            enrolledCourses: []
        };

        users.push(newUser);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            {
                success: true,
                message: 'Account created successfully',
                user: userWithoutPassword
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}

// Get all users (for admin)
export async function GET(request: NextRequest) {
    try {
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        return NextResponse.json({
            success: true,
            users: usersWithoutPasswords,
            total: users.length
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
// app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

// This would reference the same users array from signup
// In production, this would query a database
let users: Array<{
    id: string;
    fullName: string;
    email: string;
    password: string;
    createdAt: string;
    enrolledCourses: number[];
}> = [];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = signinSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password'
                },
                { status: 401 }
            );
        }

        // Verify password (in production, use bcrypt.compare)
        if (user.password !== password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password'
                },
                { status: 401 }
            );
        }

        // Generate session token (in production, use JWT)
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        // Set HTTP-only cookie for session
        const response = NextResponse.json(
            {
                success: true,
                message: 'Sign in successful',
                user: userWithoutPassword,
                token: sessionToken
            },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}