// Helper functions for XP, levels, and gamification

const XP_LEVEL_THRESHOLD = 1500

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_LEVEL_THRESHOLD) + 1
}

export function calculateXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  const nextLevelXP = currentLevel * XP_LEVEL_THRESHOLD
  return nextLevelXP - currentXP
}

export function calculateLevelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp)
  const currentLevelStart = (currentLevel - 1) * XP_LEVEL_THRESHOLD
  const currentLevelEnd = currentLevel * XP_LEVEL_THRESHOLD
  const progress = ((xp - currentLevelStart) / (currentLevelEnd - currentLevelStart)) * 100
  return Math.min(100, Math.max(0, progress))
}

export function getXPCategory(category: string): string {
  const categories: Record<string, string> = {
    homework: "Homework",
    participation: "Participation",
    test: "Test",
    attendance: "Attendance",
    project: "Project",
    quiz: "Quiz",
    extra_credit: "Extra Credit",
  }
  return categories[category] || category
}

export function getBadgeIcon(badgeName: string): string {
  const icons: Record<string, string> = {
    "Perfect Attendance": "🎯",
    "Top Performer": "⭐",
    "Great Participation": "🙋",
    "Homework Master": "📚",
    "Quiz Champion": "🏆",
    "Project Star": "✨",
    "Consistent Learner": "📈",
    "Team Player": "🤝",
  }
  return icons[badgeName] || "🏆"
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayOfWeek] || "Unknown"
}

export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

export function getAttendanceStatus(percentage: number): string {
  if (percentage >= 95) return "Excellent"
  if (percentage >= 85) return "Good"
  if (percentage >= 75) return "Fair"
  return "Poor"
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function generateRandomCode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export function isWithinDateRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate
}

export function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

export function getMonthStartDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getMonthEndDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

