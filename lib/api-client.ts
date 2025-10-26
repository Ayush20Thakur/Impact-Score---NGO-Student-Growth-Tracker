// API Client Utilities
const API_BASE = "/api"

export const apiClient = {
  // Auth
  login: async (email: string, password: string, role: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    })
    return res.json()
  },

  register: async (name: string, email: string, password: string, role: string, center: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, center }),
    })
    return res.json()
  },

  // Students
  getStudents: async (teacherId?: string, centerId?: string) => {
    const params = new URLSearchParams()
    if (teacherId) params.append("teacherId", teacherId)
    if (centerId) params.append("centerId", centerId)
    const res = await fetch(`${API_BASE}/students?${params}`)
    return res.json()
  },

  getStudent: async (id: string) => {
    const res = await fetch(`${API_BASE}/students/${id}`)
    return res.json()
  },

  createStudent: async (name: string, center: string, teacherId: string) => {
    const res = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, center, teacherId }),
    })
    return res.json()
  },

  // XP
  awardXP: async (studentId: string, amount: number, category: string, note: string, teacherId: string) => {
    const res = await fetch(`${API_BASE}/xp/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, amount, category, note, teacherId }),
    })
    return res.json()
  },

  // Badges
  awardBadge: async (studentId: string, badgeName: string, description: string, icon: string) => {
    const res = await fetch(`${API_BASE}/badges/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, badgeName, description, icon }),
    })
    return res.json()
  },

  // Goals
  createGoal: async (studentId: string, title: string, description: string, deadline: string) => {
    const res = await fetch(`${API_BASE}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, title, description, deadline }),
    })
    return res.json()
  },

  updateGoal: async (goalId: string, progress: number) => {
    const res = await fetch(`${API_BASE}/goals`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, progress }),
    })
    return res.json()
  },

  // Analytics
  getAnalytics: async (centerId?: string, teacherId?: string) => {
    const params = new URLSearchParams()
    if (centerId) params.append("centerId", centerId)
    if (teacherId) params.append("teacherId", teacherId)
    const res = await fetch(`${API_BASE}/analytics?${params}`)
    return res.json()
  },
}
