# Digital Skills Hub (DSH)

A modern, fully responsive course and mentorship learning platform built to provide beginner-friendly digital education. Digital Skills Hub offers three core courses with interactive video lessons, user enrollment, mentorship tracking, and admin dashboard management.

## 🎯 Project Overview

Digital Skills Hub is a complete learning management system designed for aspiring digital professionals. It provides:

- **Free Online Courses**: Three beginner-friendly courses in Digital Marketing, Figma Design, and UI/UX Design
- **Interactive Learning**: Embedded YouTube course videos with lesson tracking
- **Mentorship Program**: Connect with expert mentors for guidance and support
- **User Dashboard**: Track your learning progress and enrolled courses
- **Admin Dashboard**: Manage users, courses, mentors, and platform analytics
- **Feedback System**: Collect valuable student feedback about courses and learning experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

## 📊 Features

### For Learners
- ✅ Browse and enroll in courses (completely free)
- ✅ Watch course videos and track progress
- ✅ Access personalized user dashboard
- ✅ View mentor profiles and expertise
- ✅ Submit feedback on courses and platform
- ✅ Secure sign-up and authentication

### For Mentors
- ✅ Manage assigned courses
- ✅ Track student progress
- ✅ Provide guidance and mentorship
- ✅ View analytics on student engagement

### For Administrators
- ✅ Complete admin dashboard with analytics
- ✅ User management (view all enrolled students)
- ✅ Course management and monitoring
- ✅ Mentor management
- ✅ Feedback analytics
- ✅ System statistics and insights

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 19)
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI, shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React hooks, localStorage for local state
- **Icons**: Lucide React
- **Animations**: Framer Motion, Motion, Tailwind CSS animations

### Backend
- **Runtime**: Next.js API Routes
- **Data Storage**: localStorage (client-side) for development
- **Email Integration**: Prepared for Nodemailer/email service integration

### Development Tools
- **Language**: TypeScript
- **Build Tool**: Next.js (Turbopack)
- **Code Quality**: ESLint
- **Package Manager**: npm

### Video Integration
- **Video Platform**: YouTube embedded videos
- **Player**: Native browser video player
- **Video Service**: YouTube course videos for each course

## 📁 Project Structure

\`\`\`
digital-skills-hub/
├── app/
│   ├── page.tsx                    # Homepage/Landing page
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Global styles and theme
│   ├── auth/
│   │   ├── signup/page.tsx         # User registration page
│   │   └── signin/page.tsx         # User login page
│   ├── course/
│   │   └── [id]/page.tsx           # Individual course page with videos
│   ├── dashboard/page.tsx          # User dashboard (learner view)
│   └── admin/page.tsx              # Admin dashboard
├── components/
│   ├── glassmorphism-nav.tsx       # Navigation bar
│   ├── hero-section.tsx            # Landing page hero
│   ├── courses-section.tsx         # Courses display
│   ├── mentors-section.tsx         # Mentors display
│   ├── feedback-section.tsx        # Feedback form
│   ├── footer.tsx                  # Footer with contact info
│   ├── ui/                         # shadcn/ui components
│   └── [...other components]
├── public/
│   └── images/                     # Static images
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── next.config.mjs                 # Next.js configuration
\`\`\`

## 🎨 Color Scheme

The platform uses a sophisticated color palette for an attractive, professional appearance:

- **Primary**: Green (emerald) - #10B981, #059669
- **Secondary**: Golden Yellow (amber) - #FBBF24, #F59E0B
- **Background**: Black - #000000, #1F2937
- **Text**: White/Light Gray - #FFFFFF, #E5E7EB
- **Accents**: Green and Golden Yellow combinations

## 📚 Available Courses

### 1. Digital Marketing
- Beginner-friendly introduction to digital marketing
- 10 interactive video lessons
- Learn marketing fundamentals and strategies
- **Mentor**: Sarah Johnson

### 2. Figma Design
- Learn UI/UX design with Figma
- 10 practical design lessons
- Create professional design mockups
- **Mentor**: Sarah Chen

### 3. UI/UX Design
- Master user interface and experience design
- 10 comprehensive video tutorials
- Design beautiful and functional interfaces
- **Mentor**: Alex Rodriguez

## 👥 Team

### Administrator & Founder
- **Name**: Hikma Hamza
- **Email**: hamzahikma9@gmail.com
- **Phone**: +250794414171
- **Role**: Platform creator and administrator

### Mentors (3)
- **Sarah Johnson** - Digital Marketing Expert
- **Sarah Chen** - Figma Design Specialist
- **Alex Rodriguez** - UI/UX Design Expert

### Enrolled Students
- 15 active learners across all courses
- Diverse backgrounds and skill levels
- Engaging with courses and providing feedback

## 🚀 Key Features Explained

### User Authentication
- Sign-up with email and password
- Secure sign-in for existing users
- Profile persistence using localStorage
- Form validation with error messages

### Course Enrollment
- One-click enrollment in any course
- Immediate access to course videos
- Track which courses you're enrolled in
- Progress tracking on dashboard

### Video Learning
- Embedded YouTube videos for each lesson
- Multiple videos per course
- Video playlist selector
- HD quality streaming

### Admin Analytics
- Real-time user statistics
- Course enrollment metrics
- Student engagement tracking
- Mentor performance overview
- Feedback analytics

### Feedback Collection
- Post-course feedback forms
- Questions about course quality
- Site satisfaction ratings
- Learning effectiveness scores
- Feedback sent to admin email

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Mobile Devices**: 375px - 640px
- **Tablets**: 641px - 1024px
- **Desktop**: 1025px and above
- **Large Screens**: 1440px+

All pages adapt beautifully to different screen sizes with:
- Touch-friendly buttons and forms
- Optimized navigation for mobile
- Readable font sizes
- Proper spacing and layout
- Fast loading times

## 🔐 Data Security

- User data stored in browser localStorage
- Password validation and confirmation
- Form validation with Zod schema
- Protected admin dashboard
- Feedback data transmitted securely

## 📧 Contact & Support

For support, inquiries, or feedback:
- **Email**: hamzahikma9@gmail.com
- **Phone**: +250794414171

## 📄 License

All Rights Reserved © Digital Skills Hub
Developed by Hikma Hamza

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Active and Fully Functional
