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
    const studentId = searchParams.get("studentId")

    let classes

    if (studentId) {
      classes = await prisma.liveClass.findMany({
        where: {
          liveClassStudents: {
            some: { studentId },
          },
        },
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          liveClassStudents: true,
        },
      })
    } else if (teacherId) {
      classes = await prisma.liveClass.findMany({
        where: { teacherId },
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          liveClassStudents: true,
        },
      })
    } else {
      classes = await prisma.liveClass.findMany({
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          liveClassStudents: true,
        },
      })
    }

    return NextResponse.json({ success: true, data: classes }, { status: 200 })
  } catch (error) {
    console.error("Error fetching live classes:", error)
    return NextResponse.json({ error: "Failed to fetch live classes" }, { status: 500 })
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
      return NextResponse.json({ error: "Only teachers can create live classes" }, { status: 403 })
    }

    const { title, description, googleMeetLink, scheduledTime, center, studentIds } = await request.json()

    if (!title || !googleMeetLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const liveClass = await prisma.liveClass.create({
      data: {
        teacherId: payload.userId,
        title,
        description: description || "",
        googleMeetLink,
        scheduledTime: new Date(scheduledTime),
        center: center || "Main Center",
        status: "SCHEDULED",
      },
    })

    // Add students to live class
    if (studentIds && Array.isArray(studentIds)) {
      for (const studentId of studentIds) {
        await prisma.liveClassStudent.create({
          data: {
            liveClassId: liveClass.id,
            studentId,
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: liveClass }, { status: 201 })
  } catch (error) {
    console.error("Error creating live class:", error)
    return NextResponse.json({ error: "Failed to create live class" }, { status: 500 })
  }
}
