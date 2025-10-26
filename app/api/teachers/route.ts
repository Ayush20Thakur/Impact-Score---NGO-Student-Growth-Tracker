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
    const center = searchParams.get("center")

    const where: any = {}
    if (center) where.center = center

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        students: true,
        schedules: true,
        liveClasses: true,
      },
    })

    return NextResponse.json({ success: true, data: teachers }, { status: 200 })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
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
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create teachers" }, { status: 403 })
    }

    const { name, email, password, subject, center } = await request.json()

    if (!name || !email || !password) {
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
        role: "TEACHER",
        center: center || "Main Center",
      },
    })

    // Create teacher
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        subject: subject || "",
        center: center || "Main Center",
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, data: teacher }, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}

