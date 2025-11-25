// lib/database-schema.ts
/**
 * Database Schema and Type Definitions for Digital Skills Hub
 * PostgreSQL-ready version
 */

// ============================================================================
// USER SCHEMA
// ============================================================================

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'mentor' | 'admin';
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
}

export const USER_TABLE_SQL = `
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    profile_image TEXT,
    bio TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    country VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255)
);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);
`;

// ============================================================================
// COURSE SCHEMA
// ============================================================================

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  mentorId: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  thumbnail?: string;
  coverImage?: string;
  price: number;
  isPremium: boolean;
  isPublished: boolean;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  requirements: string[];
  learningOutcomes: string[];
}

export const COURSE_TABLE_SQL = `
CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    mentor_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    level course_level DEFAULT 'Beginner',
    duration VARCHAR(50),
    thumbnail TEXT,
    cover_image TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_premium BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_students INT DEFAULT 0,
    topics JSON,
    requirements JSON,
    learning_outcomes JSON,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id)
);
CREATE INDEX idx_slug ON courses(slug);
CREATE INDEX idx_mentor ON courses(mentor_id);
CREATE INDEX idx_category ON courses(category);
`;

// ============================================================================
// VIDEO LESSON SCHEMA
// ============================================================================

export interface VideoLesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'upload';
  duration: string;
  order: number;
  isFree: boolean;
  resources?: string[];
  createdAt: string;
  updatedAt: string;
}

export const VIDEO_TABLE_SQL = `
CREATE TYPE video_type AS ENUM ('youtube', 'vimeo', 'upload');

CREATE TABLE IF NOT EXISTS video_lessons (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    video_type video_type DEFAULT 'youtube',
    duration VARCHAR(20),
    order_index INT NOT NULL,
    is_free BOOLEAN DEFAULT FALSE,
    resources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE INDEX idx_course ON video_lessons(course_id);
CREATE INDEX idx_order ON video_lessons(course_id, order_index);
`;

// ============================================================================
// ENROLLMENT SCHEMA
// ============================================================================

export interface Enrollment {
  id: string;
  userId: string;
  courseId: number;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  lastAccessedAt: string;
  completedVideos: number[];
  certificateIssued: boolean;
  certificateUrl?: string;
  status: 'active' | 'completed' | 'dropped';
}

export const ENROLLMENT_TABLE_SQL = `
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');

CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_videos JSON,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    status enrollment_status DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
);
CREATE INDEX idx_user ON enrollments(user_id);
CREATE INDEX idx_course ON enrollments(course_id);
CREATE INDEX idx_status ON enrollments(status);
`;

// ============================================================================
// MENTOR SCHEMA
// ============================================================================

export interface Mentor {
  id: number;
  userId: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  certifications: string[];
  profileImage?: string;
  email: string;
  phone?: string;
  availability: string;
  languages: string[];
  rating: number;
  totalReviews: number;
  totalStudents: number;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  availabilityStatus: 'available' | 'busy' | 'offline';
  createdAt: string;
  updatedAt: string;
}

export const MENTOR_TABLE_SQL = `
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');

CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    expertise JSON,
    experience VARCHAR(100),
    education TEXT,
    certifications JSON,
    profile_image TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    availability TEXT,
    languages JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_students INT DEFAULT 0,
    social_media JSON,
    availability_status availability_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user ON mentors(user_id);
CREATE INDEX idx_availability ON mentors(availability_status);
`;

// ============================================================================
// FEEDBACK SCHEMA
// ============================================================================

export interface Feedback {
  id: string;
  userId?: string;
  name: string;
  email: string;
  courseId?: number;
  courseName: string;
  rating: number;
  comments: string;
  courseQuality?: number;
  mentorSupport?: number;
  contentRelevance?: number;
  platformUsability?: number;
  wouldRecommend?: boolean;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'responded';
  adminResponse?: string;
  respondedAt?: string;
}

export const FEEDBACK_TABLE_SQL = `
CREATE TYPE feedback_status AS ENUM ('pending', 'reviewed', 'responded');

CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    course_id INT,
    course_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT NOT NULL,
    course_quality INT CHECK (course_quality >= 1 AND course_quality <= 5),
    mentor_support INT CHECK (mentor_support >= 1 AND mentor_support <= 5),
    content_relevance INT CHECK (content_relevance >= 1 AND content_relevance <= 5),
    platform_usability INT CHECK (platform_usability >= 1 AND platform_usability <= 5),
    would_recommend BOOLEAN,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status feedback_status DEFAULT 'pending',
    admin_response TEXT,
    responded_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
CREATE INDEX idx_user ON feedback(user_id);
CREATE INDEX idx_course ON feedback(course_id);
CREATE INDEX idx_status ON feedback(status);
CREATE INDEX idx_submitted ON feedback(submitted_at);
`;

// ============================================================================
// SESSION SCHEMA
// ============================================================================

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export const SESSION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user ON sessions(user_id);
CREATE INDEX idx_token ON sessions(token);
CREATE INDEX idx_expires ON sessions(expires_at);
`;

// ============================================================================
// VIDEO PROGRESS SCHEMA
// ============================================================================

export interface VideoProgress {
  id: string;
  userId: string;
  videoId: number;
  courseId: number;
  watchedSeconds: number;
  totalSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

export const PROGRESS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS video_progress (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    video_id INT NOT NULL,
    course_id INT NOT NULL,
    watched_seconds INT DEFAULT 0,
    total_seconds INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES video_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (user_id, video_id)
);
CREATE INDEX idx_user_course ON video_progress(user_id, course_id);
`;
