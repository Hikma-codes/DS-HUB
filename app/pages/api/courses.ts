// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Course data structure
const courses = [
    {
        id: 1,
        title: "Digital Marketing",
        description: "Learn the fundamentals of digital marketing, including SEO, social media marketing, email campaigns, and analytics.",
        mentor: "Marcus Johnson",
        mentorTitle: "Digital Marketing Expert",
        mentorBio: "10+ years of experience in digital marketing strategy and execution",
        level: "Beginner",
        duration: "8 weeks",
        rating: 4.8,
        videos: [
            { id: 1, title: "Digital Marketing Full Course 2026 | Digital Marketing Tutorial For Beginners | Simplilearn", url: "https://www.youtube.com/watch?v=BZLUEKnMfIY", duration: "8:52:07" },
            { id: 2, title: "Complete SEO Fundamentals for beginners", url: "https://www.youtube.com/watch?v=xsVTqzratPs", duration: "1:57:02" },
            { id: 3, title: "Social Media Marketing Full COurse", url: "https://www.youtube.com/watch?v=i7MrqwbmN4Y", duration: "7:36:35" },
            { id: 4, title: "Content Marketing Trends You Can't Ignore in 2025", url: "https://www.youtube.com/watch?v=0BRO25Fj91U", duration: "1:15:35" },
            { id: 5, title: "Email Marketing Campaigns", url: "https://www.youtube.com/watch?v=DvwUgqX3ZF4", duration: "3:10:23" },
            { id: 6, title: "Google Ads Basics", url: "https://www.youtube.com/watch?v=a-JmhK9nKJk", duration: "1:00:59" },
            { id: 7, title: "Facebook & Instagram Ads", url: "https://www.youtube.com/watch?v=8LBrajllEPk", duration: "34:33" },
            { id: 8, title: "Digital Marketing Metrics and Measurement", url: "https://www.youtube.com/watch?v=KdSxujyEBZQ&t=55s", duration: "1:26:41" },
            { id: 9, title: "How to Build & Sell AI Automations", url: "https://www.youtube.com/watch?v=5TxSqvPbnWw&t=146s", duration: "1:50:22" }
        ],
        topics: ["SEO", "Social Media", "Email Marketing", "Digital Marketing", "Analytics"],
        requirements: ["Basic computer skills", "Internet connection", "Willingness to learn"]
    },
    {
        id: 2,
        title: "Figma Design",
        description: "Master Figma for UI/UX design. Learn to create wireframes, prototypes, and design systems for modern applications.",
        mentor: "Sarah Chen",
        mentorTitle: "Figma Design Specialist",
        mentorBio: "Senior product designer with expertise in design systems and prototyping",
        level: "Beginner",
        duration: "6 weeks",
        rating: 4.9,
        videos: [
            { id: 1, title: "Introduction to Figma", url: "https://www.youtube.com/embed/dXQ7IHkTiMM", duration: "12:45" },
            { id: 2, title: "Figma Interface & Tools", url: "https://www.youtube.com/watch?v=GrZZuv2m2_0", duration: "7:07" },
            { id: 3, title: "Creating Frames & Layouts", url: "https://www.youtube.com/embed/wvFd-z7jSaA", duration: "20:15" },
            { id: 4, title: "Working with Components", url: "https://www.youtube.com/embed/k74IrUNaJVk", duration: "25:40" },
            { id: 5, title: "Auto Layout Mastery", url: "https://www.youtube.com/embed/TyaGpGDFczw", duration: "22:20" },
            { id: 6, title: "Prototyping & Interactions", url: "https://www.youtube.com/embed/k1iwiHJrAWI?si=sNhVem_J6Srp8D0m", duration: "20:35" },
            { id: 7, title: "Design Systems in Figma", url: "https://www.youtube.com/embed/Dtd40cHQQlk", duration: "30:45" },
        ],

        topics: ["Interface Design", "Prototyping", "Components", "Auto Layout", "Design Systems"],
        requirements: ["Computer with internet", "Figma account (free)", "Basic design sense"]
    },
    {
        id: 3,
        title: "UI/UX Design",
        description: "Comprehensive UI/UX design course covering user research, wireframing, prototyping, and usability testing.",
        mentor: "Elena Rodriguez",
        mentorTitle: "UI/UX Design Expert",
        mentorBio: "Lead UX designer with 8+ years creating user-centered digital experiences",
        level: "Beginner",
        duration: "10 weeks",
        rating: 4.7,
        videos: [
            { id: 1, title: "Introduction to UX", url: "https://www.youtube.com/embed/c9Wg6Cb_YlU", duration: "1:26:21" },
            { id: 2, title: "User Research Methods", url: "https://www.youtube.com/embed/WpzmOH0hrEM", duration: "1:38:29" },
            { id: 3, title: "Creating User Personas", url: "https://www.youtube.com/embed/XnG4c4gXaQY", duration: "12:52" },
            { id: 4, title: "Information Architecture", url: "https://www.youtube.com/embed/OJLfjgVlwDo?si=AI4XMDgfAZQdagq_", duration: "17:20" },
            { id: 5, title: "Wireframin & Prototyping", url: "https://www.youtube.com/embed/qpH7-KFWZRI", duration: "25:20" },
            { id: 6, title: "Usability Testing", url: "https://www.youtube.com/embed/nYCJTea1AUQ?si=RNcxUcK7QDFDgyyf", duration: "1:03:36" },
            { id: 7, title: "Color Theory for Beginners", url: "https://www.youtube.com/embed/2QTHs7QSR9o?si=hQDYVM4Qf8n5alE1", duration: "24:45" },
            { id: 8, title: "Mobile UI Design", url: "https://www.youtube.com/embed/ThmHV38Ecqk?si=-zLMmlRlt7PKNbxa", duration: "4:14:45" },
            { id: 9, title: "UX Portfolio Creation", url: "https://www.youtube.com/embed/mmgxspm9JWs?si=Co1nf_7CtHUkeDZw", duration: "17:16" }
        ],
        topics: ["User Research", "Wireframing", "Portofolio Creation", "Usability", "Design Thinking"],
        requirements: ["Creative mindset", "Basic computer skills", "Design software (Figma/Sketch)"]
    }
];

// GET all courses
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // Get specific course by ID
        if (id) {
            const course = courses.find(c => c.id === parseInt(id));
            if (!course) {
                return NextResponse.json(
                    { success: false, error: 'Course not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, course });
        }

        // Get all courses
        return NextResponse.json({
            success: true,
            courses,
            total: courses.length
        });

    } catch (error) {
        console.error('Get courses error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}