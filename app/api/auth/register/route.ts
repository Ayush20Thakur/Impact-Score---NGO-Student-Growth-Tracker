import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/jwt"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, center } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Normalize role to uppercase
    const normalizedRole = role.toUpperCase()

    // Validate role
    const validRoles = ["ADMIN", "TEACHER", "STUDENT", "PARENT"]
    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: normalizedRole,
        center: center || "Main Center",
      },
    })

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      center: newUser.center,
    })

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      { success: true, user: userWithoutPassword, token },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
