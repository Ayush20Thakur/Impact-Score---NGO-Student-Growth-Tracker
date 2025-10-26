import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

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

    const where: any = {}
    if (studentId) where.studentId = studentId

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { deadline: "asc" },
    })

    return NextResponse.json({ success: true, data: goals }, { status: 200 })
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { studentId, title, description, deadline } = await request.json()

    if (!studentId || !title || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const goal = await prisma.goal.create({
      data: {
        studentId,
        title,
        description: description || "",
        deadline: new Date(deadline),
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ success: true, data: goal }, { status: 201 })
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const { goalId, progress, status } = await request.json()

    if (!goalId) {
      return NextResponse.json({ error: "Missing goal ID" }, { status: 400 })
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        progress: progress !== undefined ? Math.min(100, progress) : undefined,
        status: status || undefined,
      },
    })

    return NextResponse.json({ success: true, data: goal }, { status: 200 })
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}
