// Mock data and API utilities
export interface Student {
  id: string
  name: string
  level: number
  xp: number
  badges: Badge[]
  goals: Goal[]
  attendance: number
  center: string
  parentId?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  earnedDate: string
  color: string
}

export interface Goal {
  id: string
  title: string
  description: string
  progress: number
  deadline: string
  studentId: string
}

export interface XPTransaction {
  id: string
  studentId: string
  amount: number
  category: string
  note?: string
  teacherId: string
  date: string
}

// Mock API functions
export const getStudents = async (centerId?: string): Promise<Student[]> => {
  // Mock data - in real app, this would fetch from your API
  return [
    {
      id: "1",
      name: "Priya Sharma",
      level: 5,
      xp: 1250,
      badges: [],
      goals: [],
      attendance: 95,
      center: "Main Center",
    },
    {
      id: "2",
      name: "Rahul Kumar",
      level: 4,
      xp: 980,
      badges: [],
      goals: [],
      attendance: 88,
      center: "Main Center",
    },
  ]
}

export const awardXP = async (studentId: string, amount: number, category: string, note?: string): Promise<void> => {
  // Mock API call
  console.log(`Awarded ${amount} XP to student ${studentId} for ${category}`)
}

export const createGoal = async (
  studentId: string,
  title: string,
  description: string,
  deadline: string,
): Promise<Goal> => {
  // Mock API call
  return {
    id: Date.now().toString(),
    title,
    description,
    progress: 0,
    deadline,
    studentId,
  }
}

export const getAnalytics = async (centerId?: string) => {
  // Mock analytics data
  return {
    totalStudents: 143,
    totalXP: 156780,
    averageAttendance: 87,
    badgesAwarded: 234,
    monthlyGrowth: 15,
  }
}
