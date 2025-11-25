// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const feedbackSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    course: z.string().min(1, 'Please select a course'),
    rating: z.number().min(1).max(5),
    comments: z.string().min(10, 'Comments must be at least 10 characters'),
    courseQuality: z.number().min(1).max(5).optional(),
    mentorSupport: z.number().min(1).max(5).optional(),
    contentRelevance: z.number().min(1).max(5).optional(),
    platformUsability: z.number().min(1).max(5).optional(),
    wouldRecommend: z.boolean().optional()
});

// In-memory feedback storage
let feedbacks: Array<{
    id: string;
    name: string;
    email: string;
    course: string;
    rating: number;
    comments: string;
    courseQuality?: number;
    mentorSupport?: number;
    contentRelevance?: number;
    platformUsability?: number;
    wouldRecommend?: boolean;
    submittedAt: string;
    status: 'pending' | 'reviewed' | 'responded';
}> = [];

// POST - Submit feedback
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = feedbackSchema.safeParse(body);

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

        const feedbackData = validationResult.data;

        // Create feedback entry
        const newFeedback = {
            id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...feedbackData,
            submittedAt: new Date().toISOString(),
            status: 'pending' as const
        };

        feedbacks.push(newFeedback);

        // In production, send email notification to admin
        // await sendEmailNotification(newFeedback);

        return NextResponse.json(
            {
                success: true,
                message: 'Feedback submitted successfully. Thank you for your input!',
                feedback: newFeedback
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Submit feedback error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - Get all feedback (admin only)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const course = searchParams.get('course');

        let filteredFeedback = [...feedbacks];

        // Filter by status
        if (status && ['pending', 'reviewed', 'responded'].includes(status)) {
            filteredFeedback = filteredFeedback.filter(f => f.status === status);
        }

        // Filter by course
        if (course) {
            filteredFeedback = filteredFeedback.filter(f =>
                f.course.toLowerCase().includes(course.toLowerCase())
            );
        }

        // Calculate statistics
        const stats = {
            total: feedbacks.length,
            pending: feedbacks.filter(f => f.status === 'pending').length,
            reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
            responded: feedbacks.filter(f => f.status === 'responded').length,
            averageRating: feedbacks.length > 0
                ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                : 0,
            averageCourseQuality: feedbacks.filter(f => f.courseQuality).length > 0
                ? (feedbacks.filter(f => f.courseQuality).reduce((sum, f) => sum + (f.courseQuality || 0), 0) /
                    feedbacks.filter(f => f.courseQuality).length).toFixed(1)
                : 0,
            recommendationRate: feedbacks.filter(f => f.wouldRecommend !== undefined).length > 0
                ? ((feedbacks.filter(f => f.wouldRecommend === true).length /
                    feedbacks.filter(f => f.wouldRecommend !== undefined).length) * 100).toFixed(1)
                : 0
        };

        return NextResponse.json({
            success: true,
            feedbacks: filteredFeedback,
            stats,
            total: filteredFeedback.length
        });

    } catch (error) {
        console.error('Get feedback error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Update feedback status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { feedbackId, status } = body;

        if (!feedbackId || !status) {
            return NextResponse.json(
                { success: false, error: 'Feedback ID and status are required' },
                { status: 400 }
            );
        }

        if (!['pending', 'reviewed', 'responded'].includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            );
        }

        const feedback = feedbacks.find(f => f.id === feedbackId);

        if (!feedback) {
            return NextResponse.json(
                { success: false, error: 'Feedback not found' },
                { status: 404 }
            );
        }

        feedback.status = status;

        return NextResponse.json({
            success: true,
            message: 'Feedback status updated successfully',
            feedback
        });

    } catch (error) {
        console.error('Update feedback error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}