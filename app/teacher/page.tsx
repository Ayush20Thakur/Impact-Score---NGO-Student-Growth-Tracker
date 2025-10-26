"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Award, Plus, Star, LogOut, CheckCircle, Target, Calendar, Clock, Trash2 } from "lucide-react"

// Mock data
const mockStudents = [
  {
    id: 1,
    name: "Priya Sharma",
    xp: 1250,
    level: 5,
    attendance: 95,
    badges: ["Good Student", "Perfect Attendance", "Helper"],
    recentActivity: "Completed math homework",
    goals: ["Improve handwriting", "Learn multiplication tables"],
  },
  {
    id: 2,
    name: "Rahul Kumar",
    xp: 980,
    level: 4,
    attendance: 88,
    badges: ["Team Player", "Creative Thinker"],
    recentActivity: "Helped classmate with reading",
    goals: ["Read 5 books this month", "Improve attendance"],
  },
  {
    id: 3,
    name: "Anita Singh",
    xp: 1100,
    level: 4,
    attendance: 92,
    badges: ["Quick Learner", "Good Behavior"],
    recentActivity: "Scored 90% in science test",
    goals: ["Master fractions", "Join art club"],
  },
]

const behaviorCategories = [
  { id: "attendance", name: "Attendance", xp: 10 },
  { id: "homework", name: "Homework Completion", xp: 25 },
  { id: "behavior", name: "Good Behavior", xp: 15 },
  { id: "participation", name: "Class Participation", xp: 20 },
  { id: "hygiene", name: "Personal Hygiene", xp: 10 },
  { id: "helping", name: "Helping Others", xp: 30 },
]

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [xpForm, setXpForm] = useState({ category: "", points: "", note: "" })
  const [goalForm, setGoalForm] = useState({ student: "", goal: "", deadline: "" })
  const [badgeStudent, setBadgeStudent] = useState("")
  const [scheduleForm, setScheduleForm] = useState({
    students: [] as string[],
    subject: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    room: "",
  })
  const [schedules, setSchedules] = useState<any[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Check for both uppercase and lowercase for compatibility
      if (parsedUser.role !== "TEACHER" && parsedUser.role !== "teacher") {
        alert("Access denied. Teacher role required.")
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
      fetchSchedules()
    } else {
      window.location.href = "/"
    }
  }, [])

  const fetchSchedules = async () => {
    setLoadingSchedules(true)
    try {
      const response = await fetch("/api/schedules?teacherId=2")
      const data = await response.json()
      if (data.success) {
        setSchedules(data.data)
      }
    } catch (error) {
      console.error("Error fetching schedules:", error)
    } finally {
      setLoadingSchedules(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleAwardXP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent || !xpForm.category || !xpForm.points) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // Find the student in mock data to get their ID
      const student = mockStudents.find(s => s.id.toString() === selectedStudent)
      if (!student) {
        alert("Student not found")
        return
      }

      // Update the student's XP in the database
      const response = await fetch("/api/students/update-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: `s${selectedStudent}`, // Convert to database ID format
          xp: Number.parseInt(xpForm.points),
          category: xpForm.category,
          note: xpForm.note,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Awarded ${xpForm.points} XP to ${student.name} for ${xpForm.category}!`)
        setXpForm({ category: "", points: "", note: "" })
        setSelectedStudent("")
      } else {
        alert(`❌ Failed to award XP: ${data.error}`)
      }
    } catch (error) {
      console.error("Error awarding XP:", error)
      alert("❌ Failed to award XP. Please try again.")
    }
  }

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!goalForm.student || !goalForm.goal || !goalForm.deadline) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const student = mockStudents.find(s => s.id.toString() === goalForm.student)
      if (!student) {
        alert("Student not found")
        return
      }

      const response = await fetch("/api/students/add-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: `s${goalForm.student}`,
          title: goalForm.goal,
          description: goalForm.goal,
          deadline: goalForm.deadline,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Goal set for ${student.name}: ${goalForm.goal}`)
        setGoalForm({ student: "", goal: "", deadline: "" })
      } else {
        alert(`❌ Failed to set goal: ${data.error}`)
      }
    } catch (error) {
      console.error("Error setting goal:", error)
      alert("❌ Failed to set goal. Please try again.")
    }
  }

  const handleAwardBadge = async (badgeName: string, badgeDescription: string, icon: string) => {
    if (!badgeStudent) {
      alert("Please select a student first")
      return
    }

    try {
      const student = mockStudents.find(s => s.id.toString() === badgeStudent)
      if (!student) {
        alert("Student not found")
        return
      }

      const response = await fetch("/api/students/add-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: `s${badgeStudent}`,
          name: badgeName,
          description: badgeDescription,
          icon: icon,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Badge "${badgeName}" awarded to ${student.name}!`)
        setBadgeStudent("")
      } else {
        alert(`❌ Failed to award badge: ${data.error}`)
      }
    } catch (error) {
      console.error("Error awarding badge:", error)
      alert("❌ Failed to award badge. Please try again.")
    }
  }

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!scheduleForm.students.length || !scheduleForm.subject || !scheduleForm.dayOfWeek || !scheduleForm.startTime || !scheduleForm.endTime) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: "2",
          studentIds: scheduleForm.students,
          subject: scheduleForm.subject,
          dayOfWeek: scheduleForm.dayOfWeek,
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          room: scheduleForm.room,
          center: "Main Center",
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`✅ Schedule created for ${scheduleForm.subject}!`)
        setScheduleForm({
          students: [],
          subject: "",
          dayOfWeek: "",
          startTime: "",
          endTime: "",
          room: "",
        })
        fetchSchedules()
      } else {
        alert(`❌ Failed to create schedule: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating schedule:", error)
      alert("❌ Failed to create schedule. Please try again.")
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) {
      return
    }

    try {
      const response = await fetch(`/api/schedules?scheduleId=${scheduleId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        alert("✅ Schedule deleted successfully!")
        fetchSchedules()
      } else {
        alert(`❌ Failed to delete schedule: ${data.error}`)
      }
    } catch (error) {
      console.error("Error deleting schedule:", error)
      alert("❌ Failed to delete schedule. Please try again.")
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setScheduleForm(prev => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId]
    }))
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Teacher</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Students</p>
                  <p className="text-3xl font-bold">{mockStudents.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">XP Awarded Today</p>
                  <p className="text-3xl font-bold">450</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                  <p className="text-3xl font-bold">92%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Goals</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="evaluate">Behavior Evaluation</TabsTrigger>
            <TabsTrigger value="goals">Set Goals</TabsTrigger>
            <TabsTrigger value="badges">Award Badges</TabsTrigger>
            <TabsTrigger value="schedule">Schedule/Timetable</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStudents.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <Badge variant="outline">Level {student.level}</Badge>
                    </div>
                    <CardDescription>
                      {student.xp} XP • {student.attendance}% attendance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress to Next Level</span>
                        <span className="text-sm text-gray-600">{student.xp}/1500 XP</span>
                      </div>
                      <Progress value={(student.xp / 1500) * 100} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Recent Activity</p>
                      <p className="text-sm text-gray-600">{student.recentActivity}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Badges ({student.badges.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {student.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Current Goals</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {student.goals.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evaluate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Award XP Points</CardTitle>
                  <CardDescription>Recognize student achievements and behaviors</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAwardXP} className="space-y-4">
                    <div>
                      <Label htmlFor="student-select">Select Student</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Behavior Category</Label>
                      <Select
                        value={xpForm.category}
                        onValueChange={(value) => setXpForm({ ...xpForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {behaviorCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name} (+{category.xp} XP)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="points">XP Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={xpForm.points}
                        onChange={(e) => setXpForm({ ...xpForm, points: e.target.value })}
                        placeholder="Enter XP amount"
                      />
                    </div>

                    <div>
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Textarea
                        id="note"
                        value={xpForm.note}
                        onChange={(e) => setXpForm({ ...xpForm, note: e.target.value })}
                        placeholder="Add a motivational note..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Award XP
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavior Categories</CardTitle>
                  <CardDescription>Quick reference for XP values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {behaviorCategories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">+{category.xp} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Set Personal Goals</CardTitle>
                <CardDescription>Create personalized goals for students</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSetGoal} className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="goal-student">Select Student</Label>
                    <Select
                      value={goalForm.student}
                      onValueChange={(value) => setGoalForm({ ...goalForm, student: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goal-text">Goal Description</Label>
                    <Textarea
                      id="goal-text"
                      value={goalForm.goal}
                      onChange={(e) => setGoalForm({ ...goalForm, goal: e.target.value })}
                      placeholder="Describe the goal..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deadline">Target Date</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Set Goal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Award Special Badges</CardTitle>
                <CardDescription>Recognize exceptional achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="badge-student">Select Student</Label>
                  <Select value={badgeStudent} onValueChange={setBadgeStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student to award badge" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Perfect Attendance",
                      description: "100% attendance for a month",
                      color: "bg-green-100 text-green-800",
                      icon: "🎯",
                    },
                    {
                      name: "Academic Excellence",
                      description: "Top performer in academics",
                      color: "bg-blue-100 text-blue-800",
                      icon: "📚",
                    },
                    {
                      name: "Team Leader",
                      description: "Outstanding leadership skills",
                      color: "bg-purple-100 text-purple-800",
                      icon: "👑",
                    },
                    {
                      name: "Creative Genius",
                      description: "Exceptional creativity",
                      color: "bg-pink-100 text-pink-800",
                      icon: "🎨",
                    },
                    {
                      name: "Helper",
                      description: "Always helps classmates",
                      color: "bg-yellow-100 text-yellow-800",
                      icon: "🤝",
                    },
                    {
                      name: "Improvement Star",
                      description: "Most improved student",
                      color: "bg-orange-100 text-orange-800",
                      icon: "⭐",
                    },
                  ].map((badge, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {badge.name}
                      </div>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleAwardBadge(badge.name, badge.description, badge.icon)}
                      >
                        Award Badge
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Schedule Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Create Schedule/Timetable
                  </CardTitle>
                  <CardDescription>Set up class schedules for students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateSchedule} className="space-y-4">
                    <div>
                      <Label>Select Students</Label>
                      <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                        {mockStudents.map((student) => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={scheduleForm.students.includes(`s${student.id}`)}
                              onChange={() => toggleStudentSelection(`s${student.id}`)}
                              className="rounded"
                            />
                            <label htmlFor={`student-${student.id}`} className="text-sm cursor-pointer">
                              {student.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={scheduleForm.subject}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                        placeholder="e.g., Mathematics, Science"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="dayOfWeek">Day of Week</Label>
                      <Select
                        value={scheduleForm.dayOfWeek}
                        onValueChange={(value) => setScheduleForm({ ...scheduleForm, dayOfWeek: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Monday</SelectItem>
                          <SelectItem value="2">Tuesday</SelectItem>
                          <SelectItem value="3">Wednesday</SelectItem>
                          <SelectItem value="4">Thursday</SelectItem>
                          <SelectItem value="5">Friday</SelectItem>
                          <SelectItem value="6">Saturday</SelectItem>
                          <SelectItem value="0">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={scheduleForm.startTime}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={scheduleForm.endTime}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="room">Room (Optional)</Label>
                      <Input
                        id="room"
                        value={scheduleForm.room}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                        placeholder="e.g., Room 101"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Schedule
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Schedules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Schedules
                  </CardTitle>
                  <CardDescription>View and manage existing schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSchedules ? (
                    <p className="text-center text-gray-500">Loading schedules...</p>
                  ) : schedules.length === 0 ? (
                    <p className="text-center text-gray-500">No schedules created yet</p>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {schedules.map((schedule) => (
                        <div key={schedule.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{schedule.subject}</h4>
                              <p className="text-sm text-gray-600">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][schedule.dayOfWeek]}
                              </p>
                              <p className="text-sm text-gray-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                              {schedule.room && (
                                <p className="text-sm text-gray-600">📍 {schedule.room}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Students: {schedule.studentIds.length}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
