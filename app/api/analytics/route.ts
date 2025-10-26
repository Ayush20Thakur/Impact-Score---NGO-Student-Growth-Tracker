import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get("centerId")
    const teacherId = searchParams.get("teacherId")

    let students = database.students

    if (centerId) {
      students = students.filter((s) => s.center === centerId)
    }

    if (teacherId) {
      students = students.filter((s) => s.teacherId === teacherId)
    }

    const analytics = {
      totalStudents: students.length,
      totalXP: students.reduce((sum, s) => sum + s.xp, 0),
      averageAttendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / (students.length || 1)),
      badgesAwarded: students.reduce((sum, s) => sum + s.badges.length, 0),
      monthlyGrowth: 15,
      topStudents: [...students].sort((a, b) => b.xp - a.xp).slice(0, 5),
    }

    return NextResponse.json({ success: true, data: analytics }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
