import { NextResponse } from "next/server"

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication failed") {
    super(401, message, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Insufficient permissions") {
    super(403, message, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(404, `${resource} not found`, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(409, message, "CONFLICT")
    this.name = "ConflictError"
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = "Internal server error") {
    super(500, message, "INTERNAL_SERVER_ERROR")
    this.name = "InternalServerError"
  }
}

export function handleError(error: unknown) {
  console.error("Error:", error)

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  )
}

export function createSuccessResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  )
}

export function createErrorResponse(error: APIError) {
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      code: error.code,
    },
    { status: error.statusCode }
  )
}

