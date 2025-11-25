import { NextRequest, NextResponse } from 'next/server';
import courses from '../../../lib/courses';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const course = courses.find((c) => c.id === parseInt(id));
            if (!course) return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
            return NextResponse.json({ success: true, course });
        }

        return NextResponse.json({ success: true, courses, total: courses.length });
    } catch (error) {
        console.error('Get courses error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
