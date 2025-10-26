import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

const XP_LEVEL_THRESHOLD = 1500

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload || payload.role !== "TEACHER") {
      return NextResponse.json({ error: "Only teachers can award XP" }, { status: 403 })
    }

    const { studentId, amount, category, note } = await request.json()

    if (!studentId || !amount || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Award XP
    const newXP = student.xp + amount
    const newLevel = Math.floor(newXP / XP_LEVEL_THRESHOLD) + 1

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    })

    // Record transaction
    const transaction = await prisma.xPTransaction.create({
      data: {
        studentId,
        teacherId: payload.userId,
        amount,
        category,
        note,
      },
    })

    return NextResponse.json(
      { success: true, data: { student: updatedStudent, transaction } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error awarding XP:", error)
    return NextResponse.json({ error: "Failed to award XP" }, { status: 500 })
  }
}
