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
    const teacherId = searchParams.get("teacherId")
    const center = searchParams.get("center")

    const where: any = {}
    if (teacherId) where.teacherId = teacherId
    if (center) where.center = center

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        badges: true,
        goals: true,
      },
    })

    return NextResponse.json({ success: true, data: students }, { status: 200 })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
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
      return NextResponse.json({ error: "Only teachers can create students" }, { status: 403 })
    }

    const { name, email, password, center, teacherId } = await request.json()

    if (!name || !email || !password || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create user first
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        center: center || "Main Center",
      },
    })

    // Create student
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        teacherId,
        center: center || "Main Center",
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
