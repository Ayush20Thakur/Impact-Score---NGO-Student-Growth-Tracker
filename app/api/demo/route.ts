import { NextResponse } from "next/server"

// Simple demo API endpoint
export async function GET() {
  return NextResponse.json({
    message: "ImpactScore API is running",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Echo back the data for demo purposes
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
