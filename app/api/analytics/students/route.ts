import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { name: true, email: true } },
        badges: true,
        goals: true,
        xpTransactions: true,
        attendanceRecords: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Calculate statistics
    const totalXP = student.xp
    const level = student.level
    const badgeCount = student.badges.length
    const goalCount = student.goals.length
    const completedGoals = student.goals.filter((g) => g.status === "COMPLETED").length
    const attendanceCount = student.attendanceRecords.length
    const presentCount = student.attendanceRecords.filter((a) => a.status === "PRESENT").length
    const attendancePercentage = attendanceCount > 0 ? (presentCount / attendanceCount) * 100 : 0

    // XP breakdown by category
    const xpByCategory: Record<string, number> = {}
    student.xpTransactions.forEach((tx) => {
      xpByCategory[tx.category] = (xpByCategory[tx.category] || 0) + tx.amount
    })

    const analytics = {
      student: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        level,
        totalXP,
      },
      badges: {
        total: badgeCount,
        list: student.badges,
      },
      goals: {
        total: goalCount,
        completed: completedGoals,
        pending: goalCount - completedGoals,
        list: student.goals,
      },
      attendance: {
        total: attendanceCount,
        present: presentCount,
        percentage: Math.round(attendancePercentage),
      },
      xp: {
        total: totalXP,
        byCategory: xpByCategory,
        transactions: student.xpTransactions,
      },
    }

    return NextResponse.json({ success: true, data: analytics }, { status: 200 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

