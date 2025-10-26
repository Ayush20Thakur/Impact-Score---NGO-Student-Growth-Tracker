import { ValidationError } from "./errors"

export interface ValidationRule {
  field: string
  required?: boolean
  type?: "string" | "number" | "boolean" | "email" | "date" | "array"
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export function validateData(data: Record<string, any>, rules: ValidationRule[]): void {
  const errors: string[] = []

  for (const rule of rules) {
    const value = data[rule.field]

    // Check required
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push(`${rule.field} is required`)
      continue
    }

    if (value === undefined || value === null || value === "") {
      continue
    }

    // Check type
    if (rule.type) {
      if (rule.type === "email") {
        if (!isValidEmail(value)) {
          errors.push(`${rule.field} must be a valid email`)
        }
      } else if (rule.type === "date") {
        if (isNaN(Date.parse(value))) {
          errors.push(`${rule.field} must be a valid date`)
        }
      } else if (rule.type === "array") {
        if (!Array.isArray(value)) {
          errors.push(`${rule.field} must be an array`)
        }
      } else if (typeof value !== rule.type) {
        errors.push(`${rule.field} must be of type ${rule.type}`)
      }
    }

    // Check string length
    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`)
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.field} must be at most ${rule.maxLength} characters`)
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`)
      }
    }

    // Check number range
    if (typeof value === "number") {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`)
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${rule.field} must be at most ${rule.max}`)
      }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        errors.push(typeof result === "string" ? result : `${rule.field} is invalid`)
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "))
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "")
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key])
    }
  }
  return sanitized
}

export function validatePagination(page?: string, limit?: string): { page: number; limit: number } {
  const pageNum = page ? parseInt(page, 10) : 1
  const limitNum = limit ? parseInt(limit, 10) : 10

  if (isNaN(pageNum) || pageNum < 1) {
    throw new ValidationError("Page must be a positive number")
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new ValidationError("Limit must be between 1 and 100")
  }

  return { page: pageNum, limit: limitNum }
}

