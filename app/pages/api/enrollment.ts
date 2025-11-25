// app/api/enrollment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const enrollmentSchema = z.object({
    userId: z.string(),
    courseId: z.number().int().positive()
});

// In-memory enrollment data (replace with database in production)
let enrollments: Array<{
    id: string;
    userId: string;
    courseId: number;
    enrolledAt: string;
    progress: number;
    completedVideos: number[];
    lastAccessed: string;
}> = [];

// POST - Enroll in a course
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = enrollmentSchema.safeParse(body);

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

        const { userId, courseId } = validationResult.data;

        // Check if already enrolled
        const existingEnrollment = enrollments.find(
            e => e.userId === userId && e.courseId === courseId
        );

        if (existingEnrollment) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Already enrolled in this course'
                },
                { status: 409 }
            );
        }

        // Create enrollment
        const newEnrollment = {
            id: `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedVideos: [],
            lastAccessed: new Date().toISOString()
        };

        enrollments.push(newEnrollment);

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully enrolled in course',
                enrollment: newEnrollment
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Get user enrollments
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        const userEnrollments = enrollments.filter(e => e.userId === userId);

        return NextResponse.json({
            success: true,
            enrollments: userEnrollments,
            total: userEnrollments.length
        });

    } catch (error) {
        console.error('Get enrollments error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update enrollment progress
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { enrollmentId, videoId, progress } = body;

        if (!enrollmentId) {
            return NextResponse.json(
                { success: false, error: 'Enrollment ID is required' },
                { status: 400 }
            );
        }

        const enrollment = enrollments.find(e => e.id === enrollmentId);

        if (!enrollment) {
            return NextResponse.json(
                { success: false, error: 'Enrollment not found' },
                { status: 404 }
            );
        }

        // Update completed videos
        if (videoId && !enrollment.completedVideos.includes(videoId)) {
            enrollment.completedVideos.push(videoId);
        }

        // Update progress
        if (progress !== undefined) {
            enrollment.progress = Math.min(100, Math.max(0, progress));
        }

        enrollment.lastAccessed = new Date().toISOString();

        return NextResponse.json({
            success: true,
            message: 'Progress updated successfully',
            enrollment
        });

    } catch (error) {
        console.error('Update progress error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}