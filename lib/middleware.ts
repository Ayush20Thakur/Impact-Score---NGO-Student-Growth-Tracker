import { NextRequest, NextResponse } from "next/server"
import { verifyToken, JWTPayload } from "./jwt"

export function withAuth(handler: (req: NextRequest, context: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context: any) => {
    try {
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const payload = verifyToken(token)

      if (!payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      // Attach user info to request
      ;(req as any).user = payload

      return handler(req, context)
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function withRole(...allowedRoles: string[]) {
  return (handler: (req: NextRequest, context: any) => Promise<NextResponse>) => {
    return async (req: NextRequest, context: any) => {
      try {
        const authHeader = req.headers.get("authorization")
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const payload = verifyToken(token)

        if (!payload) {
          return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
        }

        if (!allowedRoles.includes(payload.role)) {
          return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
        }

        ;(req as any).user = payload

        return handler(req, context)
      } catch (error) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
      }
    }
  }
}

export function getUser(req: NextRequest): JWTPayload | null {
  return (req as any).user || null
}

