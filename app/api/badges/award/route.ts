import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { studentId, badgeName, description, icon } = await request.json()

    if (!studentId || !badgeName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const student = database.students.find((s) => s.id === studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if badge already exists
    if (student.badges.some((b) => b.name === badgeName)) {
      return NextResponse.json({ error: "Badge already awarded" }, { status: 400 })
    }

    const newBadge = {
      id: `badge${Date.now()}`,
      name: badgeName,
      description: description || "",
      earnedDate: new Date().toISOString(),
      icon: icon || "🏆",
    }

    student.badges.push(newBadge)

    return NextResponse.json({ success: true, data: { student, badge: newBadge } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to award badge" }, { status: 500 })
  }
}
