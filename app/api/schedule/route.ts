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

    let schedules

    if (studentId) {
      schedules = await prisma.schedule.findMany({
        where: {
          scheduleStudents: {
            some: { studentId },
          },
        },
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          scheduleStudents: true,
        },
      })
    } else if (teacherId) {
      schedules = await prisma.schedule.findMany({
        where: { teacherId },
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          scheduleStudents: true,
        },
      })
    } else {
      schedules = await prisma.schedule.findMany({
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          scheduleStudents: true,
        },
      })
    }

    return NextResponse.json({ success: true, data: schedules }, { status: 200 })
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
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
      return NextResponse.json({ error: "Only teachers can create schedules" }, { status: 403 })
    }

    const { subject, dayOfWeek, startTime, endTime, room, center, studentIds } = await request.json()

    if (!subject || dayOfWeek === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const schedule = await prisma.schedule.create({
      data: {
        teacherId: payload.userId,
        subject,
        dayOfWeek,
        startTime: startTime || "09:00",
        endTime: endTime || "10:00",
        room: room || "",
        center: center || "Main Center",
      },
    })

    // Add students to schedule
    if (studentIds && Array.isArray(studentIds)) {
      for (const studentId of studentIds) {
        await prisma.scheduleStudent.create({
          data: {
            scheduleId: schedule.id,
            studentId,
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: schedule }, { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}
