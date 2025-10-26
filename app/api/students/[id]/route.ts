import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const student = database.students.find((s) => s.id === params.id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: student }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const studentIndex = database.students.findIndex((s) => s.id === params.id)

    if (studentIndex === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const updates = await request.json()
    database.students[studentIndex] = { ...database.students[studentIndex], ...updates }

    return NextResponse.json({ success: true, data: database.students[studentIndex] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}
