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
    const category = searchParams.get("category")
    const studentId = searchParams.get("studentId")

    const where: any = {}
    if (teacherId) where.teacherId = teacherId
    if (category) where.category = category

    let materials

    if (studentId) {
      materials = await prisma.studyMaterial.findMany({
        where: {
          studyMaterialStudents: {
            some: { studentId },
          },
        },
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          studyMaterialStudents: true,
        },
      })
    } else {
      materials = await prisma.studyMaterial.findMany({
        where,
        include: {
          teacher: { select: { user: { select: { name: true } } } },
          studyMaterialStudents: true,
        },
      })
    }

    return NextResponse.json({ success: true, data: materials }, { status: 200 })
  } catch (error) {
    console.error("Error fetching study materials:", error)
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 })
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
      return NextResponse.json({ error: "Only teachers can upload study materials" }, { status: 403 })
    }

    const { title, description, category, fileUrl, fileName, fileType, center, studentIds } = await request.json()

    if (!title || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const material = await prisma.studyMaterial.create({
      data: {
        teacherId: payload.userId,
        title,
        description: description || "",
        category: category || "CLASS_NOTES",
        fileUrl,
        fileName: fileName || "document",
        fileType: fileType || "pdf",
        center: center || "Main Center",
      },
    })

    // Add students to material
    if (studentIds && Array.isArray(studentIds)) {
      for (const studentId of studentIds) {
        await prisma.studyMaterialStudent.create({
          data: {
            studyMaterialId: material.id,
            studentId,
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: material }, { status: 201 })
  } catch (error) {
    console.error("Error creating study material:", error)
    return NextResponse.json({ error: "Failed to upload material" }, { status: 500 })
  }
}
