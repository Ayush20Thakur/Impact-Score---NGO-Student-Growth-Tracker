// Authentication utilities - simplified for demo
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student" | "parent"
  center?: string
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export const login = async (email: string, password: string, role: string): Promise<User> => {
  // Simple demo authentication
  const mockUser: User = {
    id: "1",
    name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
    email,
    role: role as User["role"],
    center: "Main Center",
  }

  localStorage.setItem("user", JSON.stringify(mockUser))
  return mockUser
}

export const logout = () => {
  localStorage.removeItem("user")
  window.location.href = "/"
}

export const requireAuth = (allowedRoles?: User["role"][]) => {
  const user = getCurrentUser()

  if (!user) {
    window.location.href = "/"
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = "/"
    return null
  }

  return user
}
