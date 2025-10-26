"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Award, Building, BarChart3, Download, LogOut, UserPlus, Settings } from "lucide-react"

// Mock data
const mockData = {
  centers: [
    { id: 1, name: "Main Center", students: 45, teachers: 8, avgXP: 1250 },
    { id: 2, name: "North Branch", students: 32, teachers: 6, avgXP: 980 },
    { id: 3, name: "South Branch", students: 28, teachers: 5, avgXP: 1100 },
    { id: 4, name: "East Branch", students: 38, teachers: 7, avgXP: 1180 },
  ],
  analytics: {
    totalStudents: 143,
    totalTeachers: 26,
    totalXP: 156780,
    badgesAwarded: 234,
    attendanceRate: 87,
    academicProgress: 78,
  },
  topStudents: [
    { name: "Priya Sharma", center: "Main Center", xp: 2450, badges: 12 },
    { name: "Rahul Kumar", center: "North Branch", xp: 2380, badges: 11 },
    { name: "Anita Singh", center: "South Branch", xp: 2290, badges: 10 },
    { name: "Vikram Patel", center: "East Branch", xp: 2150, badges: 9 },
  ],
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedCenter, setSelectedCenter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Check for both uppercase and lowercase for compatibility
      if (parsedUser.role !== "ADMIN" && parsedUser.role !== "admin") {
        alert("Access denied. Admin role required.")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Admin</Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold">{mockData.analytics.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-3xl font-bold">{mockData.analytics.totalTeachers}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total XP Earned</p>
                  <p className="text-3xl font-bold">{mockData.analytics.totalXP.toLocaleString()}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Badges Awarded</p>
                  <p className="text-3xl font-bold">{mockData.analytics.badgesAwarded}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="centers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="centers">Centers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="centers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Centers Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Centers Overview</CardTitle>
                  <CardDescription>Performance across all centers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.centers.map((center) => (
                      <div key={center.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{center.name}</h3>
                          <p className="text-sm text-gray-600">
                            {center.students} students • {center.teachers} teachers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{center.avgXP} XP</p>
                          <p className="text-sm text-gray-600">Avg per student</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>Across all centers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.topStudents.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.center}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{student.xp} XP</p>
                          <p className="text-sm text-gray-600">{student.badges} badges</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Attendance Rate</span>
                      <span className="text-sm text-gray-600">{mockData.analytics.attendanceRate}%</span>
                    </div>
                    <Progress value={mockData.analytics.attendanceRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Academic Progress</span>
                      <span className="text-sm text-gray-600">{mockData.analytics.academicProgress}%</span>
                    </div>
                    <Progress value={mockData.analytics.academicProgress} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Engagement Score</span>
                      <span className="text-sm text-gray-600">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">New Students</span>
                      <span className="text-green-600 font-semibold">+12 this month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">XP Growth</span>
                      <span className="text-blue-600 font-semibold">+15% this month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Badge Awards</span>
                      <span className="text-purple-600 font-semibold">+28 this month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Download detailed analytics and impact reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Available Reports</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Student Progress Report</h4>
                          <p className="text-sm text-gray-600">Detailed progress for all students</p>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Center Performance</h4>
                          <p className="text-sm text-gray-600">Comparative analysis by center</p>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Impact Summary</h4>
                          <p className="text-sm text-gray-600">Overall impact metrics</p>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Custom Report</h3>
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select center" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Centers</SelectItem>
                          <SelectItem value="main">Main Center</SelectItem>
                          <SelectItem value="north">North Branch</SelectItem>
                          <SelectItem value="south">South Branch</SelectItem>
                          <SelectItem value="east">East Branch</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last Quarter</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage system-wide configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">XP & Badge Settings</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Attendance XP</span>
                          <span className="text-sm font-medium">10 XP</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Homework Completion</span>
                          <span className="text-sm font-medium">25 XP</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Good Behavior</span>
                          <span className="text-sm font-medium">15 XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Center Management</h3>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Building className="h-4 w-4 mr-2" />
                        Add New Center
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Centers
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
