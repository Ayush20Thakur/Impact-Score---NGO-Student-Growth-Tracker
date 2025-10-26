import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    console.log("📊 Get Student Data Request for ID:", studentId)

    if (!studentId) {
      return NextResponse.json({ error: "Missing student ID" }, { status: 400 })
    }

    // Find the student in the database
    // Try to find by exact ID first, then try to find by index (for Prisma IDs)
    let student = database.students.find((s) => s.id === studentId)

    // If not found and studentId looks like a Prisma ID (long string), use first student as fallback
    if (!student && studentId.length > 10) {
      console.log("🔄 Using fallback to first student for Prisma ID")
      // For demo purposes, map any Prisma student ID to the first student in the database
      student = database.students[0]
    }

    if (!student) {
      console.log("❌ Student not found")
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    console.log("✅ Found student:", student.name, "with", student.goals.length, "goals and", student.badges.length, "badges")
    if (student.goals.length > 0) {
      console.log("📋 Goals:", student.goals.map(g => ({ id: g.id, title: g.title })))
    }

    // Calculate next level XP
    const nextLevelXP = student.level * 1500

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        name: student.name,
        level: student.level,
        xp: student.xp,
        nextLevelXP,
        badges: student.badges,
        goals: student.goals,
        attendance: student.attendance,
        center: student.center,
        totalBadges: student.badges.length,
        streak: 12, // Mock data for now
        rank: 3, // Mock data for now
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching student data:", error)
    return NextResponse.json({ error: "Failed to fetch student data" }, { status: 500 })
  }
}

