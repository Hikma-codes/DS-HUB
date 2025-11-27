// app/api/mentors/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mentor data
const mentors = [
    {
        id: 1,
        name: "Marcus Johnson",
        title: "Digital Marketing Expert",
        bio: "10+ years of experience in digital marketing strategy and execution. Specialized in SEO, content marketing, and social media campaigns.",
        email: "marcus.j@digitalskillshub.com",
        phone: "+1 (555) 123-4567",
        expertise: ["Digital Marketing", "SEO", "Social Media", "Content Strategy", "Analytics"],
        courses: [1], // Course IDs
        students: 156,
        rating: 4.8,
        totalReviews: 89,
        availability: "Monday-Friday, 9 AM - 5 PM EST",
        languages: ["English", "Spanish"],
        experience: "10 years",
        education: "MBA in Marketing, Stanford University",
        certifications: [
            "Google Ads Certified",
            "HubSpot Content Marketing",
            "Facebook Blueprint Certified"
        ],
        socialMedia: {
            linkedin: "https://linkedin.com/in/sarahjohnson",
            twitter: "https://twitter.com/sarahj_marketing"
        },
        availability_status: "available"
    },
    {
        id: 2,
        name: "Sarah Chen",
        title: "Figma Design Specialist",
        bio: "Senior product designer with expertise in design systems and prototyping. Passionate about creating intuitive user experiences.",
        email: "sarah.c@digitalskillshub.com",
        phone: "+1 (555) 234-5678",
        expertise: ["Figma", "UI Design", "Design Systems", "Prototyping", "User Research"],
        courses: [2],
        students: 203,
        rating: 4.9,
        totalReviews: 124,
        availability: "Tuesday-Saturday, 10 AM - 6 PM PST",
        languages: ["English", "Mandarin"],
        experience: "7 years",
        education: "BFA in Graphic Design, Rhode Island School of Design",
        certifications: [
            "Certified Figma Expert",
            "Design Thinking Professional",
            "UX Design Institute Graduate"
        ],
        socialMedia: {
            linkedin: "https://linkedin.com/in/sarahchen",
            dribbble: "https://dribbble.com/sarahchen"
        },
        availability_status: "available"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        title: "UI/UX Design Expert",
        bio: "Lead UX designer with 8+ years creating user-centered digital experiences. Advocate for accessible and inclusive design.",
        email: "elena.r@digitalskillshub.com",
        phone: "+1 (555) 345-6789",
        expertise: ["UI/UX Design", "User Research", "Wireframing", "Usability Testing", "Design Thinking"],
        courses: [3],
        students: 187,
        rating: 4.7,
        totalReviews: 96,
        availability: "Monday-Friday, 11 AM - 7 PM EST",
        languages: ["English", "Portuguese"],
        experience: "8 years",
        education: "MS in Human-Computer Interaction, Carnegie Mellon",
        certifications: [
            "Nielsen Norman Group UX Certified",
            "Google UX Design Certificate",
            "Accessibility Specialist"
        ],
        socialMedia: {
            linkedin: "https://linkedin.com/in/alexrodriguez",
            behance: "https://behance.net/alexrodriguez"
        },
        availability_status: "busy"
    }
];

// GET all mentors or specific mentor
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const courseId = searchParams.get('courseId');

        // Get specific mentor by ID
        if (id) {
            const mentor = mentors.find(m => m.id === parseInt(id));
            if (!mentor) {
                return NextResponse.json(
                    { success: false, error: 'Mentor not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, mentor });
        }

        // Get mentors by course
        if (courseId) {
            const courseMentors = mentors.filter(m =>
                m.courses.includes(parseInt(courseId))
            );
            return NextResponse.json({
                success: true,
                mentors: courseMentors,
                total: courseMentors.length
            });
        }

        // Get all mentors
        return NextResponse.json({
            success: true,
            mentors,
            total: mentors.length
        });

    } catch (error) {
        console.error('Get mentors error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Request mentorship session
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mentorId, studentId, message, preferredTime } = body;

        if (!mentorId || !studentId || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const mentor = mentors.find(m => m.id === mentorId);
        if (!mentor) {
            return NextResponse.json(
                { success: false, error: 'Mentor not found' },
                { status: 404 }
            );
        }

        // Create mentorship request
        const request_data = {
            id: `mentor_req_${Date.now()}`,
            mentorId,
            studentId,
            message,
            preferredTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // In production, send email to mentor and save to database

        return NextResponse.json({
            success: true,
            message: `Mentorship request sent to ${mentor.name}`,
            request: request_data
        }, { status: 201 });

    } catch (error) {
        console.error('Mentorship request error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}