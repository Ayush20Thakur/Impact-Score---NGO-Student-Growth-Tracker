import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { studentId, title, description, deadline } = await request.json()

    console.log("📝 Add Goal Request:", { studentId, title, description, deadline })

    if (!studentId || !title || !deadline) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the student in the database
    const student = database.students.find((s) => s.id === studentId)

    if (!student) {
      console.log("❌ Student not found:", studentId)
      console.log("Available students:", database.students.map(s => ({ id: s.id, name: s.name })))
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Create new goal
    const newGoal = {
      id: `goal-${Date.now()}`,
      title,
      description: description || title,
      progress: 0,
      deadline,
      studentId,
    }

    // Add goal to student's goals array
    student.goals.push(newGoal)

    console.log("✅ Goal added successfully:", newGoal)
    console.log("Student now has", student.goals.length, "goals")

    return NextResponse.json({
      success: true,
      data: newGoal
    }, { status: 201 })
  } catch (error) {
    console.error("Error adding goal:", error)
    return NextResponse.json({ error: "Failed to add goal" }, { status: 500 })
  }
}

