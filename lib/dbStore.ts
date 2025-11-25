import fs from 'fs'
import path from 'path'

export type EnrollmentRecord = {
    id: string
    userId: string
    courseId: number
    enrolledAt: string
    progress: number
    completedVideos: number[]
    lastAccessed: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ENROLLMENTS_PATH = path.join(DATA_DIR, 'enrollments.json')

async function ensureDataDir() {
    try {
        await fs.promises.mkdir(DATA_DIR, { recursive: true })
    } catch (e) {
        // ignore
    }
}

async function readAll(): Promise<EnrollmentRecord[]> {
    await ensureDataDir()
    try {
        const raw = await fs.promises.readFile(ENROLLMENTS_PATH, 'utf-8')
        return JSON.parse(raw || '[]') as EnrollmentRecord[]
    } catch (e) {
        return []
    }
}

async function writeAll(rows: EnrollmentRecord[]) {
    await ensureDataDir()
    await fs.promises.writeFile(ENROLLMENTS_PATH, JSON.stringify(rows, null, 2), 'utf-8')
}

export async function getEnrollmentsByUser(userId: string) {
    const all = await readAll()
    return all.filter((r) => r.userId === userId)
}

export async function findEnrollment(userId: string, courseId: number) {
    const all = await readAll()
    return all.find((r) => r.userId === userId && r.courseId === courseId) || null
}

export async function createEnrollment(record: Omit<EnrollmentRecord, 'id' | 'enrolledAt' | 'lastAccessed'>) {
    const all = await readAll()
    const id = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const rec: EnrollmentRecord = {
        id,
        userId: record.userId,
        courseId: record.courseId,
        enrolledAt: new Date().toISOString(),
        progress: record.progress ?? 0,
        completedVideos: record.completedVideos ?? [],
        lastAccessed: new Date().toISOString(),
    }
    all.push(rec)
    await writeAll(all)
    return rec
}

export async function updateEnrollmentProgress(enrollmentId: string, opts: { progress?: number; addVideoId?: number }) {
    const all = await readAll()
    const idx = all.findIndex((r) => r.id === enrollmentId)
    if (idx === -1) return null
    if (typeof opts.progress === 'number') all[idx].progress = Math.max(0, Math.min(100, Math.floor(opts.progress)))
    if (typeof opts.addVideoId === 'number' && !all[idx].completedVideos.includes(opts.addVideoId)) {
        all[idx].completedVideos.push(opts.addVideoId)
    }
    all[idx].lastAccessed = new Date().toISOString()
    await writeAll(all)
    return all[idx]
}

export async function upsertEnrollment(userId: string, courseId: number) {
    const existing = await findEnrollment(userId, courseId)
    if (existing) return existing
    return createEnrollment({ userId, courseId, progress: 0, completedVideos: [] })
}
