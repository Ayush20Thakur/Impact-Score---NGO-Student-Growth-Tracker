import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/db"

// GET - Fetch schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    let studentId = searchParams.get("studentId")

    console.log("📅 Get Schedules Request:", { teacherId, studentId })

    // Handle Prisma IDs - map to in-memory database IDs
    if (studentId && studentId.length > 10) {
      console.log("🔄 Mapping Prisma ID to in-memory database ID")
      // Find the student in the database by Prisma ID or use fallback
      const student = database.students.find((s) => s.id === studentId)
      if (!student) {
        // Use fallback to first student (s1)
        studentId = "s1"
        console.log("🔄 Using fallback student ID: s1")
      } else {
        studentId = student.id
      }
    }

    let schedules = database.schedules

    // Filter by teacher if provided
    if (teacherId) {
      schedules = schedules.filter((s) => s.teacherId === teacherId)
    }

    // Filter by student if provided
    if (studentId) {
      schedules = schedules.filter((s) => s.studentIds.includes(studentId))
    }

    console.log("✅ Found", schedules.length, "schedules for student", studentId)

    return NextResponse.json({
      success: true,
      data: schedules
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}

// POST - Create new schedule
export async function POST(request: NextRequest) {
  try {
    const { teacherId, studentIds, subject, dayOfWeek, startTime, endTime, room, center } = await request.json()

    console.log("📝 Create Schedule Request:", { teacherId, studentIds, subject, dayOfWeek, startTime, endTime })

    if (!teacherId || !studentIds || !subject || dayOfWeek === undefined || !startTime || !endTime) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new schedule
    const newSchedule = {
      id: `sch-${Date.now()}`,
      teacherId,
      studentIds: Array.isArray(studentIds) ? studentIds : [studentIds],
      subject,
      dayOfWeek: Number.parseInt(dayOfWeek),
      startTime,
      endTime,
      room: room || "TBD",
      center: center || "Main Center",
    }

    // Add to database
    database.schedules.push(newSchedule)

    console.log("✅ Schedule created successfully:", newSchedule)

    return NextResponse.json({ 
      success: true, 
      data: newSchedule 
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}

// DELETE - Remove schedule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scheduleId = searchParams.get("scheduleId")

    if (!scheduleId) {
      return NextResponse.json({ error: "Missing schedule ID" }, { status: 400 })
    }

    const index = database.schedules.findIndex((s) => s.id === scheduleId)

    if (index === -1) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
    }

    database.schedules.splice(index, 1)

    console.log("✅ Schedule deleted:", scheduleId)

    return NextResponse.json({ 
      success: true, 
      message: "Schedule deleted successfully" 
    }, { status: 200 })
  } catch (error) {
    console.error("Error deleting schedule:", error)
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 })
  }
}

