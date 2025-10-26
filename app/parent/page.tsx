"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, TrendingUp, Calendar, LogOut, MessageSquare, BookOpen, Target, Star } from "lucide-react"

// Mock data for parent's children
const childrenData = [
  {
    id: 1,
    name: "Priya Sharma",
    level: 5,
    xp: 1250,
    nextLevelXP: 1500,
    badges: 8,
    rank: 3,
    attendance: 95,
    recentActivities: [
      { activity: "Completed math homework", xp: 25, date: "2024-01-20" },
      { activity: "Perfect attendance this week", xp: 50, date: "2024-01-19" },
      { activity: "Helped classmate with reading", xp: 30, date: "2024-01-18" },
    ],
    goals: [
      { goal: "Read 5 books this month", progress: 60, deadline: "2024-01-31" },
      { goal: "Improve handwriting", progress: 80, deadline: "2024-02-15" },
    ],
    subjects: [
      { name: "Mathematics", score: 85 },
      { name: "Science", score: 92 },
      { name: "English", score: 78 },
      { name: "Social Studies", score: 88 },
    ],
    teacherNotes: [
      {
        note: "Priya showed excellent improvement in mathematics this week!",
        teacher: "Ms. Patel",
        date: "2024-01-18",
      },
      { note: "Great participation in class discussions.", teacher: "Mr. Kumar", date: "2024-01-15" },
    ],
  },
  {
    id: 2,
    name: "Arjun Sharma",
    level: 3,
    xp: 780,
    nextLevelXP: 1000,
    badges: 5,
    rank: 8,
    attendance: 88,
    recentActivities: [
      { activity: "Completed art project", xp: 35, date: "2024-01-19" },
      { activity: "Good behavior in class", xp: 15, date: "2024-01-18" },
    ],
    goals: [
      { goal: "Improve attendance", progress: 70, deadline: "2024-02-28" },
      { goal: "Learn new vocabulary", progress: 45, deadline: "2024-02-15" },
    ],
    subjects: [
      { name: "Mathematics", score: 72 },
      { name: "Science", score: 80 },
      { name: "English", score: 85 },
      { name: "Art", score: 95 },
    ],
    teacherNotes: [
      { note: "Arjun is very creative and excels in art class.", teacher: "Ms. Singh", date: "2024-01-17" },
    ],
  },
]

export default function ParentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedChild, setSelectedChild] = useState("1")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Check for both uppercase and lowercase for compatibility
      if (parsedUser.role !== "PARENT" && parsedUser.role !== "parent") {
        alert("Access denied. Parent role required.")
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
    } else {
      window.location.href = "/"
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const currentChild = childrenData.find((child) => child.id.toString() === selectedChild) || childrenData[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600">Track your children's progress</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Parent</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Child Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Child</CardTitle>
            <CardDescription>Choose which child's progress you'd like to view</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {childrenData.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.name} - Level {child.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Child Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Level</p>
                  <p className="text-3xl font-bold">{currentChild.level}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total XP</p>
                  <p className="text-3xl font-bold">{currentChild.xp}</p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Rank</p>
                  <p className="text-3xl font-bold">#{currentChild.rank}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance</p>
                  <p className="text-3xl font-bold">{currentChild.attendance}%</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{currentChild.name}'s Level Progress</CardTitle>
            <CardDescription>
              {currentChild.nextLevelXP - currentChild.xp} XP needed to reach Level {currentChild.level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {currentChild.level}</span>
                <span>Level {currentChild.level + 1}</span>
              </div>
              <Progress value={(currentChild.xp / currentChild.nextLevelXP) * 100} className="h-3" />
              <p className="text-center text-sm text-gray-600">
                {currentChild.xp} / {currentChild.nextLevelXP} XP
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Latest activities and XP earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentChild.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.activity}</p>
                          <p className="text-xs text-gray-600">{activity.date}</p>
                        </div>
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badge Collection</CardTitle>
                  <CardDescription>{currentChild.badges} badges earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Good Student", color: "bg-blue-100 text-blue-800" },
                      { name: "Perfect Attendance", color: "bg-green-100 text-green-800" },
                      { name: "Helper", color: "bg-purple-100 text-purple-800" },
                      { name: "Quick Learner", color: "bg-yellow-100 text-yellow-800" },
                    ].map((badge, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                        >
                          {badge.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>Detailed view of {currentChild.name}'s activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentChild.recentActivities.map((activity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{activity.activity}</h3>
                        <Badge variant="outline">+{activity.xp} XP</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Date: {activity.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Personal Goals</CardTitle>
                <CardDescription>Track {currentChild.name}'s progress towards their goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentChild.goals.map((goal, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{goal.goal}</h3>
                        <Badge variant="outline">
                          <Target className="h-3 w-3 mr-1" />
                          {goal.deadline}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Academic performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentChild.subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {subject.name}
                        </span>
                        <span className="text-sm text-gray-600">{subject.score}%</span>
                      </div>
                      <Progress value={subject.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Communications</CardTitle>
                <CardDescription>Messages and notes from teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentChild.teacherNotes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{note.teacher}</span>
                        <span className="text-xs text-gray-600">{note.date}</span>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))}

                  <Button className="w-full bg-transparent" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message to Teacher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
