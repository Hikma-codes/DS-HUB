"use client"
import React, { useState, useEffect, useRef } from "react"

type Lesson = { id: number; title: string; url: string; duration?: string }
type Course = { id: number; title: string; description?: string; lessons: Lesson[] }

function getYouTubeId(url?: string | null) {
    if (!url) return null
    try {
        const u = new URL(url)
        const host = u.hostname.toLowerCase()
        if (host.includes("youtube.com")) {
            const v = u.searchParams.get("v")
            if (v) return v
            if (u.pathname.includes("/embed/")) return u.pathname.split("/").pop() || null
        }
        if (host.includes("youtu.be")) return u.pathname.replace(/^\//, '') || null
    } catch (e) {
        const m = String(url).match(/(?:v=|\/)([0-9A-Za-z_-]{6,})/)
        return m ? m[1] : null
    }
    return null
}

function toEmbedUrl(url?: string) {
    if (!url) return ""
    try {
        const u = new URL(url)
        const host = u.hostname.toLowerCase()
        if (host.includes("youtube.com")) {
            const v = u.searchParams.get("v")
            if (v) return `https://www.youtube.com/embed/${v}`
            if (u.pathname.includes("/embed/")) return url
        }
        if (host.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.replace(/^\//, "")}`
        return url
    } catch (e) {
        return url || ""
    }
}

export default function CoursePlayer({ course }: { course: Course }) {
    const [current, setCurrent] = useState<Lesson | undefined>(course.lessons && course.lessons[0])
    const [completed, setCompleted] = useState<number[]>([])
    const storageKey = `course-progress-${course.id}`
    const playerRef = useRef<any>(null)
    const playerContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey)
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) setCompleted(parsed)
            }
        } catch (e) { }
    }, [storageKey])

    const saveProgress = (ids: number[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(ids))
            fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseId: course.id, completed: ids }) }).catch(() => { })
        } catch (e) { }
    }

    const markComplete = (lessonId: number) => {
        setCompleted((prev) => {
            if (prev.includes(lessonId)) return prev
            const next = [...prev, lessonId]
            saveProgress(next)
            return next
        })
    }

    const toggleComplete = (id: number) => {
        setCompleted((prev) => {
            const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            saveProgress(next)
            return next
        })
    }

    const clearProgress = () => {
        setCompleted([])
        saveProgress([])
    }

    const total = course.lessons.length
    const done = completed.length
    const percent = total === 0 ? 0 : Math.round((done / total) * 100)

    // Setup YouTube IFrame API player when the current lesson is a YouTube video
    useEffect(() => {
        if (!current) return
        const videoId = getYouTubeId(current.url)

        // destroy previous player
        try {
            if (playerRef.current && typeof playerRef.current.destroy === "function") playerRef.current.destroy()
        } catch (e) { }

        if (!videoId) {
            // nothing to initialize for non-YouTube embeds
            return
        }

        const createPlayer = () => {
            try {
                // @ts-ignore
                playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
                    videoId,
                    events: {
                        onStateChange: (ev: any) => {
                            const YT = (window as any).YT
                            if (!YT) return
                            if (ev.data === YT.PlayerState.ENDED) {
                                markComplete(current.id)
                            }
                        }
                    },
                    playerVars: { enablejsapi: 1, origin: window.location.origin }
                })
            } catch (e) { }
        }

        if ((window as any).YT && (window as any).YT.Player) {
            createPlayer()
            return () => {
                try { if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy() } catch (e) { }
                playerRef.current = null
            }
        }

        if (!document.getElementById('youtube-iframe-api')) {
            const s = document.createElement('script')
            s.id = 'youtube-iframe-api'
            s.src = 'https://www.youtube.com/iframe_api'
            document.body.appendChild(s)
        }

        ; (window as any).onYouTubeIframeAPIReady = () => {
            createPlayer()
        }

        return () => {
            try { if (playerRef.current && typeof playerRef.current.destroy === 'function') playerRef.current.destroy() } catch (e) { }
            playerRef.current = null
        }
    }, [current])

    return (
        <div className="mt-6">
            <div style={{ maxWidth: 980 }}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="text-lg font-medium">{done} / {total} lessons ({percent}%)</div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button onClick={clearProgress} className="px-3 py-1 text-sm rounded border bg-white">Clear progress</button>
                    </div>
                </div>

                <div className="mt-3" style={{ height: 8, background: '#e6e6e6', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: '#0ea5e9' }} />
                </div>

                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }} className="mt-4">
                    {getYouTubeId(current?.url) ? (
                        <div ref={playerContainerRef} id={`yt-player-${course.id}`} className="absolute inset-0 w-full h-full" />
                    ) : (
                        <iframe title={current?.title || 'lesson'} src={toEmbedUrl(current?.url)} className="absolute inset-0 w-full h-full" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    )}
                </div>

                <div className="mt-4 grid gap-2">
                    {course.lessons.map((l) => {
                        const isDone = completed.includes(l.id)
                        return (
                            <div key={l.id} className={`flex items-center justify-between p-3 rounded border ${isDone ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setCurrent(l)} className="text-left">
                                        <div className="font-medium">{l.title}</div>
                                        {l.duration && <div className="text-sm text-muted-foreground">{l.duration}</div>}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="inline-flex items-center gap-2">
                                        <input type="checkbox" checked={isDone} disabled />
                                        <span className="text-sm">Completed</span>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
