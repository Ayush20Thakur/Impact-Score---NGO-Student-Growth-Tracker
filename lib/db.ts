// Declare global type for database persistence across hot reloads
declare global {
  var _database: Database | undefined
}

// Updated database with new models
interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "teacher" | "student" | "parent"
  center: string
  createdAt: string
}

interface Student {
  id: string
  name: string
  level: number
  xp: number
  badges: Badge[]
  goals: Goal[]
  attendance: number
  center: string
  parentId?: string
  teacherId: string
}

interface Badge {
  id: string
  name: string
  description: string
  earnedDate: string
  icon: string
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  deadline: string
  studentId: string
}

interface XPTransaction {
  id: string
  studentId: string
  amount: number
  category: string
  note?: string
  teacherId: string
  date: string
}

interface Schedule {
  id: string
  teacherId: string
  studentIds: string[]
  subject: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string
  center: string
}

interface LiveClass {
  id: string
  teacherId: string
  title: string
  description: string
  googleMeetLink: string
  scheduledTime: string
  center: string
  studentIds: string[]
}

interface StudyMaterial {
  id: string
  teacherId: string
  title: string
  description: string
  category: "classNotes" | "assignments" | "referenceBooks"
  fileUrl: string
  fileName: string
  fileType: string
  center: string
  uploadedAt: string
  studentIds: string[]
}

interface ChatMessage {
  id: string
  studentId: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface Database {
  users: User[]
  students: Student[]
  schedules: Schedule[]
  liveClasses: LiveClass[]
  studyMaterials: StudyMaterial[]
  chatMessages: ChatMessage[]
  xpTransactions: XPTransaction[]
}

const initialDatabase = {
  users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@demo.com",
      password: "password",
      role: "admin" as const,
      center: "Main Center",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Ms. Patel",
      email: "teacher@demo.com",
      password: "password",
      role: "teacher" as const,
      center: "Main Center",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Priya Sharma",
      email: "student@demo.com",
      password: "password",
      role: "student" as const,
      center: "Main Center",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Mr. Sharma",
      email: "parent@demo.com",
      password: "password",
      role: "parent" as const,
      center: "Main Center",
      createdAt: new Date().toISOString(),
    },
  ] as User[],
  students: [
    {
      id: "s1",
      name: "Priya Sharma",
      level: 5,
      xp: 1250,
      badges: [
        { id: "b1", name: "Perfect Attendance", description: "100% attendance", earnedDate: "2024-01-15", icon: "🎯" },
      ],
      goals: [],
      attendance: 95,
      center: "Main Center",
      teacherId: "2",
    },
    {
      id: "s2",
      name: "Rahul Kumar",
      level: 4,
      xp: 980,
      badges: [],
      goals: [],
      attendance: 88,
      center: "Main Center",
      teacherId: "2",
    },
  ] as Student[],
  schedules: [
    {
      id: "sch1",
      teacherId: "2",
      studentIds: ["s1", "s2"],
      subject: "Mathematics",
      dayOfWeek: 1, // Monday
      startTime: "09:00",
      endTime: "10:00",
      room: "Room 101",
      center: "Main Center",
    },
    {
      id: "sch2",
      teacherId: "2",
      studentIds: ["s1", "s2"],
      subject: "English",
      dayOfWeek: 2, // Tuesday
      startTime: "10:00",
      endTime: "11:00",
      room: "Room 102",
      center: "Main Center",
    },
  ] as Schedule[],
  liveClasses: [
    {
      id: "lc1",
      teacherId: "2",
      title: "Introduction to Algebra",
      description: "Learn the basics of algebra",
      googleMeetLink: "https://meet.google.com/sample-link",
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      center: "Main Center",
      studentIds: ["s1", "s2"],
    },
  ] as LiveClass[],
  studyMaterials: [
    {
      id: "sm1",
      teacherId: "2",
      title: "Algebra Basics",
      description: "Chapter 1 - Introduction",
      category: "classNotes",
      fileUrl: "https://example.com/algebra-basics.pdf",
      fileName: "algebra-basics.pdf",
      fileType: "pdf",
      center: "Main Center",
      uploadedAt: new Date().toISOString(),
      studentIds: ["s1", "s2"],
    },
  ] as StudyMaterial[],
  chatMessages: [] as ChatMessage[],
  xpTransactions: [] as XPTransaction[],
} as Database

// Use global variable to persist database across hot reloads in development
if (!global._database) {
  global._database = initialDatabase
  console.log("🔄 Initialized new database instance with", initialDatabase.students.length, "students")
} else {
  console.log("♻️ Reusing existing database instance with", global._database.students.length, "students,", global._database.goals?.length || global._database.students.reduce((acc, s) => acc + s.goals.length, 0), "goals,", global._database.schedules.length, "schedules")
}

export const database = global._database

export {
  type User,
  type Student,
  type Badge,
  type Goal,
  type XPTransaction,
  type Schedule,
  type LiveClass,
  type StudyMaterial,
  type ChatMessage,
  type Database,
}
