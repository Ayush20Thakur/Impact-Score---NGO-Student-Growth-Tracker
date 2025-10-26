import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { studentId, name, description, icon } = await request.json()

    if (!studentId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the student in the database
    const student = database.students.find((s) => s.id === studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if student already has this badge
    const hasBadge = student.badges.some((b) => b.name === name)
    if (hasBadge) {
      return NextResponse.json({ error: "Student already has this badge" }, { status: 400 })
    }

    // Create new badge
    const newBadge = {
      id: `badge-${Date.now()}`,
      name,
      description: description || name,
      earnedDate: new Date().toISOString(),
      icon: icon || "🏆",
    }

    // Add badge to student's badges array
    student.badges.push(newBadge)

    return NextResponse.json({ 
      success: true, 
      data: newBadge 
    }, { status: 201 })
  } catch (error) {
    console.error("Error adding badge:", error)
    return NextResponse.json({ error: "Failed to add badge" }, { status: 500 })
  }
}

