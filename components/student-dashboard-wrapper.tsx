"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import StudentDashboardContent from "./student-dashboard-content"

export function StudentDashboardWrapper() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        // Check for both uppercase and lowercase for compatibility
        if (parsedUser.role !== "STUDENT" && parsedUser.role !== "student") {
          window.location.href = "/"
          return
        }
        setUser(parsedUser)
      } else {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Failed to load user:", error)
      window.location.href = "/"
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <StudentDashboardContent user={user} />
}
