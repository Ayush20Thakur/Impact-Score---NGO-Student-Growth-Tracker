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

    const badges = await prisma.badge.findMany({
      where,
      orderBy: { earnedDate: "desc" },
    })

    return NextResponse.json({ success: true, data: badges }, { status: 200 })
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 })
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
    if (!payload || payload.role !== "TEACHER") {
      return NextResponse.json({ error: "Only teachers can award badges" }, { status: 403 })
    }

    const { studentId, name, description, icon } = await request.json()

    if (!studentId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const badge = await prisma.badge.create({
      data: {
        studentId,
        name,
        description: description || "",
        icon: icon || "🏆",
      },
    })

    return NextResponse.json({ success: true, data: badge }, { status: 201 })
  } catch (error) {
    console.error("Error creating badge:", error)
    return NextResponse.json({ error: "Failed to create badge" }, { status: 500 })
  }
}

