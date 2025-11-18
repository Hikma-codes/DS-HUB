# Getting Started with Digital Skills Hub

Complete step-by-step guide to install, run, and deploy the Digital Skills Hub platform.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Node.js** (version 18.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning the repository) - [Download here](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Check Your Installation

Open your terminal/command prompt and verify:

\`\`\`bash
node --version
# Should show v18.0.0 or higher

npm --version
# Should show 9.0.0 or higher
\`\`\`

## 🔧 Installation Steps

### Step 1: Get the Project Files

**Option A: Using Git (Recommended)**
\`\`\`bash
git clone <your-repository-url>
cd digital-skills-hub
\`\`\`

**Option B: Download ZIP**
- Download the project as ZIP from GitHub
- Extract the folder on your computer
- Open terminal/command prompt in the extracted folder

### Step 2: Install Dependencies

Navigate to the project folder and install all required packages:

\`\`\`bash
npm install
\`\`\`

This will download and install all dependencies listed in `package.json`. This may take 2-5 minutes depending on your internet speed.

**What this does:**
- Installs Next.js framework
- Installs React and React DOM
- Installs Tailwind CSS for styling
- Installs UI component libraries (Radix UI, shadcn/ui)
- Installs form validation and other utilities

### Step 3: Environment Setup

Create a `.env.local` file in the project root (same level as `package.json`):

\`\`\`bash
# On Windows:
type nul > .env.local

# On Mac/Linux:
touch .env.local
\`\`\`

Add the following environment variables:

\`\`\`
NEXT_PUBLIC_APP_NAME=Digital Skills Hub
NEXT_PUBLIC_ADMIN_EMAIL=hamzahikma9@gmail.com
\`\`\`

## ▶️ Running the Application

### Development Mode (Recommended for Testing)

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
> next dev

  ▲ Next.js 14.2.25
  - Local:        http://localhost:3000
  - Environments: .env.local
\`\`\`

Open your browser and go to: **http://localhost:3000**

You should see the Digital Skills Hub homepage.

**Features in development mode:**
- Hot reload (auto-refresh when you make changes)
- Detailed error messages
- Development tools enabled

### Production Build

To build for production:

\`\`\`bash
npm run build
\`\`\`

Expected output:
\`\`\`
  ▲ Next.js 14.2.25

  ✓ Compiled successfully
  ✓ Linting and type checking
  - Collected static files
\`\`\`

Then start the production server:

\`\`\`bash
npm start
\`\`\`

The app will run at: **http://localhost:3000**

## 📖 Using the Application

### Accessing Different Pages

Once the application is running:

| Page | URL | Description |
|------|-----|-------------|
| Homepage | http://localhost:3000 | Landing page with courses overview |
| Sign Up | http://localhost:3000/auth/signup | Create new account |
| Sign In | http://localhost:3000/auth/signin | Login to account |
| Courses | Homepage (scroll down) | Browse available courses |
| Course Details | http://localhost:3000/course/1 | View course with videos |
| Dashboard | http://localhost:3000/dashboard | View enrolled courses and progress |
| Admin Dashboard | http://localhost:3000/admin | Admin management panel |

### Step-by-Step User Flow

#### 1. **Create an Account**
   - Go to http://localhost:3000/auth/signup
   - Fill in your details:
     - Full Name
     - Email address
     - Password (min. 6 characters)
     - Confirm password
   - Click "Create Account"
   - You'll be redirected to the homepage

#### 2. **Sign In**
   - Go to http://localhost:3000/auth/signin
   - Enter your registered email
   - Enter your password
   - Click "Sign In"
   - Dashboard will show your enrolled courses

#### 3. **Explore Courses**
   - On the homepage, scroll to "Our Courses" section
   - Click on any course card
   - Read the course description
   - Click "Enroll Now" button
   - You'll be added to the course

#### 4. **Watch Course Videos**
   - Go to http://localhost:3000/course/1 (for Digital Marketing)
   - http://localhost:3000/course/2 (for Figma Design)
   - http://localhost:3000/course/3 (for UI/UX Design)
   - Watch YouTube videos embedded in the page
   - Video player has full controls (play, pause, volume, fullscreen)

#### 5. **View Your Dashboard**
   - Click "Dashboard" in navigation
   - See all your enrolled courses
   - Track your progress
   - View course details

#### 6. **Admin Dashboard**
   - Click "Admin" in navigation
   - View platform statistics:
     - Total students enrolled
     - Course enrollment data
     - Mentor information
     - Feedback submissions

#### 7. **Submit Feedback**
   - Scroll to "Feedback" section on homepage
   - Fill out the feedback form:
     - Your name
     - Email address
     - Course you took
     - Rating (1-5 stars)
     - Comments
   - Click "Submit Feedback"
   - Feedback is sent to admin email

## 🎓 Available Courses

### 1. Digital Marketing (ID: 1)
- **URL**: http://localhost:3000/course/1
- **Mentor**: Sarah Johnson
- **Videos**: 10 marketing tutorial videos
- **Level**: Beginner

### 2. Figma Design (ID: 2)
- **URL**: http://localhost:3000/course/2
- **Mentor**: Sarah Chen
- **Videos**: 10 design tutorial videos
- **Level**: Beginner

### 3. UI/UX Design (ID: 3)
- **URL**: http://localhost:3000/course/3
- **Mentor**: Alex Rodriguez
- **Videos**: 10 design tutorial videos
- **Level**: Beginner

## 🛠️ Troubleshooting

### Problem: Port 3000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
\`\`\`bash
# On Mac/Linux, use a different port:
npm run dev -- -p 3001

# On Windows with PowerShell:
$env:PORT=3001; npm run dev
\`\`\`

Then visit: http://localhost:3001

### Problem: Dependencies Not Installing

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
\`\`\`

### Problem: Videos Not Loading

**Reason**: YouTube videos require internet connection
**Solution**: Ensure you have stable internet connection

### Problem: Sign-up/Sign-in Not Working

**Solution**:
1. Clear browser cookies and cache
2. Try a different browser
3. Check browser console for errors (F12 → Console tab)

### Problem: Styles Not Loading Properly

**Solution**:
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
npm start
\`\`\`

## 📦 Project Dependencies Overview

### Main Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.25 | React framework |
| react | 19 | UI library |
| tailwindcss | 4.1.9 | CSS framework |
| @radix-ui/* | Latest | Accessible UI components |
| react-hook-form | 7.60.0 | Form handling |
| zod | 3.25.67 | Data validation |
| framer-motion | 12.23.22 | Animations |

All dependencies are automatically installed by `npm install`.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Import your repository
5. Click "Deploy"
6. Your site will be live in minutes!

### Deploy to Other Platforms

- **Netlify**: Similar process to Vercel
- **AWS**: Use AWS Amplify or EC2
- **DigitalOcean**: Use App Platform
- **Heroku**: Use buildpack for Next.js

## 📝 Build Commands Reference

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clean build
rm -rf .next && npm run build
\`\`\`

## 🔧 Advanced Configuration

### Customize Email

Edit `components/feedback-section.tsx` to change admin email:

\`\`\`tsx
// Find this line and change the email
const adminEmail = "hamzahikma9@gmail.com";
\`\`\`

### Add New Courses

Edit `components/courses-section.tsx` to add new courses to the platform.

### Modify Color Scheme

Edit `app/globals.css` to change colors:
- Green: Search for `emerald` colors
- Yellow: Search for `yellow` or `amber` colors

## 📞 Support

For issues or questions:
- **Email**: hamzahikma9@gmail.com
- **Phone**: +250794414171

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] Development server starts without errors
- [ ] Homepage loads correctly
- [ ] Navigation links work
- [ ] Sign-up form is functional
- [ ] Sign-in form is functional
- [ ] Can enroll in courses
- [ ] Course videos load and play
- [ ] Dashboard displays correctly
- [ ] Admin dashboard shows data
- [ ] Feedback form works
- [ ] Responsive on mobile devices
- [ ] Green and yellow color scheme appears

## 🎉 You're Ready!

Congratulations! Your Digital Skills Hub is now running. Start exploring the platform and begin learning!

---

**Need Help?** Refer to the README.md file for more information about features and the tech stack.
