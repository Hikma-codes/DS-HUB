# DS-HUB (Digital Skills Hub)

This repository is a Next.js + TypeScript learning platform (front-end + lightweight backend API shims). The app uses the App Router (`app/`) and includes client components, server API routes, and a small file-backed data store used for local development.

This README explains every step needed to get the project running locally on Windows (PowerShell), how the important parts are wired, and where to make common edits.

---

## Table of contents
- **Requirements**
- **Quick Start (copy/paste)**
- **Project structure (important files)**
- **Local development: detailed steps**
- **Environment & secrets**
- **Seed data and persistence**
- **How lesson playback & auto-complete works**
- **Deploy / Prod notes**
- **Troubleshooting**
- **Contributing**

---

## Requirements
- Node.js 18+ (LTS recommended)
- npm (bundled with Node) or pnpm/yarn if you prefer (commands below use `npm`)
- Windows PowerShell (these instructions use PowerShell syntax)

Optional for production:
- PostgreSQL / Supabase account (if you want persistent DB replacement for the local file store)

---

## Quick Start (copy/paste)
Open PowerShell in the project root (`C:\Users\USER\Downloads\DSH_code`) and run:

```powershell
# Install dependencies
npm install


# Start dev server (Next.js)
npm run dev

# Open http://localhost:3000 in your browser
```

Notes:
- The dev server will default to port `3000` (Next will pick another port if 3000 is taken).
- If you want to stop the server press `Ctrl+C`.

---

## Project structure (important files)
- `app/` — Next.js App Router pages and API routes. Look in `app/api/*` for App Router APIs.
- `components/` — React components used by the UI. Key files:
  - `components/course-player.tsx` — lesson player, list, progress UI, auto-complete on video end.
  - `components/courses-section.tsx` — course listing / preview UI.
- `lib/` — helper modules and data:
  - `lib/courses.ts` — canonical course + lesson data (title, `url`, `duration`, descriptions). Update lesson links/durations here.
  - `lib/dbStore.ts` — small file-backed helper used by server routes for enrollments (local dev).
  - `lib/authMiddleware.ts` — basic in-memory session helpers used for sessions.
  - `lib/supabase/server.ts` — a lightweight shim (replace with real Supabase client in production).
- `data/enrollments.json` — seeded demo enrollments used when running locally.
- `app/api/enrollment` — App Router API (`route.ts`) for enrollments (GET/POST/PUT).
- `app/api/session` — App Router API to create/delete sessions.
- `app/api/progress/route.ts` — progress POST shim (client reports progress here).

---

## Local development: detailed steps

1. Clone or open the repo (you already have it on disk):

```powershell
cd C:\Users\USER\Downloads\DSH_code
```

2. Install dependencies:

```powershell
npm install
```

3. (Optional) Run TypeScript check:

```powershell
npx tsc --noEmit
```

4. Start the Next dev server:

```powershell
npm run dev
```

5. Open the browser to `http://localhost:3000`.

6. Student dashboard & user:
- Go to `http://localhost:3000/dashboard`.
- If no demo session exists, click one of the quick demo buttons (e.g. `Esi`). That calls `/api/session` and sets a demo server session cookie for local testing.
- The dashboard uses `data/enrollments.json` seeded data so the dashboard shows active progress.

7. Playing lessons:
- Open a course page (click Continue on a course card or go to `/course/1`).
- Lessons with YouTube links will use the YouTube IFrame API. When you watch a video to the end the CoursePlayer will mark that lesson complete automatically and persist progress to `localStorage` and POST to `/api/progress`.

---

## Environment & secrets

- A `.env.local` file is intentionally in `.gitignore`. For local development you usually do not need any environment variables for the setup. If you integrate a real DB or Supabase you will add credentials to `.env.local`.

Suggested `.env.local` keys for production integration (example):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=secret_key_here
DATABASE_URL=postgres://user:pass@host:5432/dbname
ALLOWED_ORIGIN=http://localhost:3000
```

If you add them, restart the dev server.

---

## Seed data and persistence

- This project uses a file-backed store for enrollments in `data/enrollments.json` (local dev). `lib/dbStore.ts` reads/writes that file.
- To reset data, edit or replace `data/enrollments.json` while the server is stopped.
- For production persistence, replace calls to `lib/dbStore` in the API routes with a connection to your DB (Supabase or Postgres). The DB schema is provided in `lib/db.ts` as SQL snippets you can run/migrate.

---

## How lesson playback & auto-complete works

- `components/course-player.tsx` does the following:
  - Renders a lesson list and an embedded player (YouTube or raw iframe).
  - For YouTube links it uses the YouTube IFrame API (script loaded dynamically). When the player fires `onStateChange` and reaches `ENDED`, the component marks the lesson complete.
  - Completed lesson IDs are stored in `localStorage` under `course-progress-{courseId}`.
  - When progress changes the player POSTs a best-effort payload to `/api/progress` (currently a shim that logs the payload).

Important: the manual checkbox is disabled in the current version to prevent manual cheating — completion is automatic from the player.

---

## Deploy / Production notes

- This repository is set up for local development. For production you should:
 1. Replace `lib/supabase/server.ts` (the shim) with a real Supabase client or connect to a Postgres DB.
 2. Move session storage from the in-memory map in `lib/authMiddleware.ts` to a DB or Redis-backed store.
 3. Replace the `data/enrollments.json` file store with DB persistence and update `app/api/enrollment/route.ts` to use the DB.
 4. Ensure `ALLOWED_ORIGIN` and other environment variables are set correctly.
 5. Use a proper build step: `npm run build` and a Node server or Vercel/Netlify for deployment.

---

## Troubleshooting

- Dev server doesn't start / shows compilation errors:
  - Run `npx tsc --noEmit` to surface TypeScript issues.
  - Check the terminal where `npm run dev` was started — Next shows compile-time and runtime errors there.

- IFrame / YouTube player not loading:
  - Make sure lesson `url` values in `lib/courses.ts` are valid YouTube `watch?v=...`, `embed/...` or `youtu.be` links. The code parses these formats.
  - Check browser console for mixed-content or blocked script errors.

- Changes don't appear in GitHub Desktop or repo UI:
  - Ensure you're editing files in the repository path `C:\Users\USER\Downloads\DSH_code` and that GitHub Desktop is pointed at the same path.
  - Run `git status` in PowerShell to confirm changed files.

- Session endpoints returning 404:
  - There are two API variants in this project: App Router (`app/api/.../route.ts`) and legacy Pages API (`app/pages/api/...`). The dev server compiles App Router endpoints under `app/api/*` and copies some legacy APIs to `.next`. Ensure you call the App Router routes (e.g., `/api/session` and `/api/enrollment`) which are implemented under `app/api` *and* `app/api` should be used by the app pages. If you added/modified endpoints under `app/pages/api`, they might not be used by the App Router pages.

---

## Editing lessons & durations

- Source of truth: `lib/courses.ts`.
  - Each lesson object has the shape: `{ id: number, title: string, url: string, duration?: string, description?: string }`.
  - Edit a lesson `url` or `duration` there and refresh the app.

Example: change the duration of the Figma lesson

```ts
// lib/courses.ts
// find the course and the lesson entry and update `duration`
```

---

## Git & pushing changes (quick)

```powershell
git status
git add .
git commit -m "Describe your changes"
git push origin main
```

If the remote rejects the push because the remote has commits, pull first then push:

```powershell
git pull --rebase origin main
git push origin main
```

---

Credits: This README was generated to match the current project layout and the local development setup on Windows PowerShell.
# Digital Skills Hub (DSH)

A modern, fully responsive course and mentorship learning platform built to provide beginner-friendly digital education. Digital Skills Hub offers three core courses with interactive video lessons, user enrollment, mentorship tracking, and admin dashboard management.

##  Project Overview

Digital Skills Hub is a complete learning management system designed for aspiring digital professionals. It provides:

- **Free Online Courses**: Three beginner-friendly courses in Digital Marketing, Figma Design, and UI/UX Design
- **Interactive Learning**: Embedded YouTube course videos with lesson tracking
- **Mentorship Program**: Connect with expert mentors for guidance and support
- **User Dashboard**: Track your learning progress and enrolled courses
- **Admin Dashboard**: Manage users, courses, mentors, and platform analytics
- **Feedback System**: Collect valuable student feedback about courses and learning experience

##  Features

### For Learners
-  Browse and enroll in courses (completely free)
-  Watch course videos and track progress
-  Access personalized user dashboard
-  View mentor profiles and expertise
-  Submit feedback on courses and platform
-  Secure sign-up and authentication

### For Mentors
- Manage assigned courses
- Track student progress
- Provide guidance and mentorship
- View analytics on student engagement

### For Administrators
-  Complete admin dashboard with analytics
-  User management (view all enrolled students)
-  Course management and monitoring
-  Mentor management
-  Feedback analytics
-  System statistics and insights

##  Tech Stack

### Frontend
- **Framework**: Next.js 14
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

##  Project Structure

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
│   └── images/                     # Images
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── next.config.mjs                 # Next.js configuration
\`\`\`

##  Color Scheme

The platform uses a sophisticated color palette for an attractive, professional appearance:

- **Primary**: Green (emerald) - #10B981, #059669
- **Secondary**: Golden Yellow (amber) - #FBBF24, #F59E0B
- **Background**: Black - #000000, #1F2937
- **Text**: White/Light Gray - #FFFFFF, #E5E7EB
- **Accents**: Green and Golden Yellow combinations

##  Available Courses

### 1. Digital Marketing
- Beginner-friendly introduction to digital marketing
- 10 interactive video lessons
- Learn marketing fundamentals and strategies
- **Mentor**: Marcus Johnson

### 2. Figma Design
- Learn UI/UX design with Figma
- 10 practical design lessons
- Create professional design mockups
- **Mentor**: Sarah Chen

### 3. UI/UX Design
- Master user interface and experience design
- 10 comprehensive video tutorials
- Design beautiful and functional interfaces
- **Mentor**: Elena Rodriguez

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

##  Key Features Explained

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


##  Data Security

- User data stored in browser localStorage
- Password validation and confirmation
- Form validation with Zod schema
- Protected admin dashboard
- Feedback data transmitted securely

## Contact & Support

For support, inquiries, or feedback:
- **Email**: hamzahikma9@gmail.com
- **Phone**: +250794414171

##  License

All Rights Reserved © Digital Skills Hub
Developed by Hikma Hamza

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Active and Fully Functional
