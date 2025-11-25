// lib/api-utils.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    details?: any;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

/**
 * Success response helper
 */
export function successResponse<T>(
    data: T,
    message?: string,
    status: number = 200
): NextResponse {
    return NextResponse.json(
        {
            success: true,
            data,
            message
        } as ApiResponse<T>,
        { status }
    );
}

/**
 * Error response helper
 */
export function errorResponse(
    error: string,
    status: number = 400,
    details?: any
): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error,
            details
        } as ApiResponse,
        { status }
    );
}

/**
 * Validation error response helper
 */
export function validationErrorResponse(error: ZodError): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: 'Validation failed',
            details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        } as ApiResponse,
        { status: 400 }
    );
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
): NextResponse {
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
        {
            success: true,
            data,
            message,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        } as ApiResponse<T[]>,
        { status: 200 }
    );
}

/**
 * Handle async route errors
 */
export function handleApiError(error: unknown): NextResponse {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return validationErrorResponse(error);
    }

    if (error instanceof Error) {
        return errorResponse(error.message, 500);
    }

    return errorResponse('Internal server error', 500);
}

/**
 * Async route wrapper with error handling
 */
export function asyncHandler(
    handler: (request: Request, ...args: any[]) => Promise<NextResponse>
) {
    return async (request: Request, ...args: any[]) => {
        try {
            return await handler(request, ...args);
        } catch (error) {
            return handleApiError(error);
        }
    };
}

/**
 * Parse query parameters
 */
export function parseQueryParams(url: string) {
    const { searchParams } = new URL(url);

    return {
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '10'),
        search: searchParams.get('search') || undefined,
        sortBy: searchParams.get('sortBy') || undefined,
        sortOrder: (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc',
        filters: Object.fromEntries(
            Array.from(searchParams.entries()).filter(
                ([key]) => !['page', 'limit', 'search', 'sortBy', 'sortOrder'].includes(key)
            )
        )
    };
}

/**
 * Generate pagination metadata
 */
export function getPaginationMeta(
    total: number,
    page: number,
    limit: number
) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
    };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Format date for API responses
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString();
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, whole: number): number {
    if (whole === 0) return 0;
    return Math.round((part / whole) * 100);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Hash password (use bcrypt in production)
 */
export async function hashPassword(password: string): Promise<string> {
    // In production, use: import bcrypt from 'bcrypt';
    // return bcrypt.hash(password, 10);

    // For development only - DO NOT USE IN PRODUCTION
    return Buffer.from(password).toString('base64');
}

/**
 * Verify password (use bcrypt in production)
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    // In production, use: import bcrypt from 'bcrypt';
    // return bcrypt.compare(password, hash);

    // For development only - DO NOT USE IN PRODUCTION
    return Buffer.from(password).toString('base64') === hash;
}

/**
 * Generate random token
 */
export function generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

/**
 * Slugify string (for URLs)
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Calculate time ago
 */
export function timeAgo(date: Date | string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

/**
 * Sleep utility (for testing)
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}