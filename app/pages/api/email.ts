// app/api/email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
    // In production, use environment variables for email credentials
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || 'hamzahikma9@gmail.com',
            pass: process.env.EMAIL_PASSWORD || '' // Use app-specific password
        }
    });
};

// POST - Send email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type) {
            return NextResponse.json(
                { success: false, error: 'Email type is required' },
                { status: 400 }
            );
        }

        const transporter = createTransporter();
        let emailOptions;

        switch (type) {
            case 'feedback':
                emailOptions = {
                    from: process.env.EMAIL_USER || 'hamzahikma9@gmail.com',
                    to: process.env.ADMIN_EMAIL || 'hamzahikma9@gmail.com',
                    subject: `New Feedback: ${data.course}`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">New Student Feedback</h2>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Course:</strong> ${data.course}</p>
                <p><strong>Rating:</strong> ${'⭐'.repeat(data.rating)} (${data.rating}/5)</p>
                <p><strong>Comments:</strong></p>
                <p style="background: white; padding: 15px; border-radius: 4px;">${data.comments}</p>
              </div>
              <p style="color: #6b7280; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          `
                };
                break;

            case 'enrollment':
                emailOptions = {
                    from: process.env.EMAIL_USER || 'hamzahikma9@gmail.com',
                    to: data.email,
                    subject: `Welcome to ${data.courseName}!`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">Welcome to Digital Skills Hub!</h2>
              <p>Hi ${data.name},</p>
              <p>Congratulations! You've successfully enrolled in <strong>${data.courseName}</strong>.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What's Next?</h3>
                <ul>
                  <li>Access your course dashboard</li>
                  <li>Start watching video lessons</li>
                  <li>Connect with your mentor</li>
                  <li>Join our learning community</li>
                </ul>
              </div>
              <a href="http://localhost:3000/course/${data.courseId}" 
                 style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 10px 0;">
                Start Learning
              </a>
              <p>Happy learning!<br>The Digital Skills Hub Team</p>
            </div>
          `
                };
                break;

            case 'welcome':
                emailOptions = {
                    from: process.env.EMAIL_USER || 'hamzahikma9@gmail.com',
                    to: data.email,
                    subject: 'Welcome to Digital Skills Hub!',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">Welcome to Digital Skills Hub!</h2>
              <p>Hi ${data.name},</p>
              <p>Thank you for joining Digital Skills Hub. We're excited to have you on board!</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Get Started:</h3>
                <ol>
                  <li>Browse our courses</li>
                  <li>Enroll in your first course</li>
                  <li>Meet your mentors</li>
                  <li>Start learning today!</li>
                </ol>
              </div>
              <a href="http://localhost:3000/courses" 
                 style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 10px 0;">
                Browse Courses
              </a>
              <p>Best regards,<br>Hikma Hamza<br>Digital Skills Hub</p>
            </div>
          `
                };
                break;

            case 'mentorship_request':
                emailOptions = {
                    from: process.env.EMAIL_USER || 'hamzahikma9@gmail.com',
                    to: data.mentorEmail,
                    subject: 'New Mentorship Request',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">New Mentorship Request</h2>
              <p>Hi ${data.mentorName},</p>
              <p>You have a new mentorship request from <strong>${data.studentName}</strong>.</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Student:</strong> ${data.studentName}</p>
                <p><strong>Email:</strong> ${data.studentEmail}</p>
                <p><strong>Preferred Time:</strong> ${data.preferredTime || 'Flexible'}</p>
                <p><strong>Message:</strong></p>
                <p style="background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
              </div>
              <p>Please respond to the student at your earliest convenience.</p>
            </div>
          `
                };
                break;

            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid email type' },
                    { status: 400 }
                );
        }

        // Send email
        // Commented out for development - uncomment in production
        // await transporter.sendMail(emailOptions);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            // In development, return email details for testing
            details: process.env.NODE_ENV === 'development' ? emailOptions : undefined
        });

    } catch (error) {
        console.error('Send email error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send email',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}