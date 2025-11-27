import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { name, email, course, rating, feedback } = await request.json()

    if (!name || !email || !feedback) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert feedback into Supabase
    const { data, error } = await supabase.from("feedback").insert([
      {
        name,
        email,
        course,
        rating,
        message: feedback,
        timestamp: new Date().toISOString(),
      },
    ]).select()

    if (error) {
      console.error("Error inserting feedback:", error)
      return NextResponse.json({ error: "Failed to store feedback" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Feedback recorded successfully", data })
  } catch (error) {
    console.error("Error processing feedback:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
