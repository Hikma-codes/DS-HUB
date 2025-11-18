import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, course, rating, feedback } = await request.json()

    if (!name || !email || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store feedback data
    const feedbackData = {
      name,
      email,
      course,
      rating,
      feedback,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Feedback received:", feedbackData)

    return NextResponse.json({ success: true, message: "Feedback recorded successfully" })
  } catch (error) {
    console.error("Error processing feedback:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
