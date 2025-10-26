import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { studentId, xp, category, note } = await request.json()

    if (!studentId || !xp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the student in the database
    const student = database.students.find((s) => s.id === studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Update student's XP
    student.xp += xp

    // Calculate new level (1500 XP per level)
    const newLevel = Math.floor(student.xp / 1500) + 1
    if (newLevel > student.level) {
      student.level = newLevel
    }

    // Add XP transaction record
    database.xpTransactions.push({
      id: `xp-${Date.now()}`,
      studentId,
      amount: xp,
      category: category || "general",
      note: note || "",
      teacherId: "2", // Default teacher ID
      date: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true, 
      data: { 
        student,
        newLevel: student.level,
        totalXP: student.xp,
      } 
    }, { status: 200 })
  } catch (error) {
    console.error("Error updating XP:", error)
    return NextResponse.json({ error: "Failed to update XP" }, { status: 500 })
  }
}

