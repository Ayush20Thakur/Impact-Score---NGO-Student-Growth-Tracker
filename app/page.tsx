"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, User } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    center: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!loginData.email || !loginData.password || !loginData.role) {
      alert("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.login(loginData.email, loginData.password, loginData.role)

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user))

        const dashboardRoutes: Record<string, string> = {
          admin: "/admin",
          teacher: "/teacher",
          student: "/student",
          parent: "/parent",
        }

        window.location.href = dashboardRoutes[loginData.role] || "/student"
      } else {
        alert(response.error || "Login failed")
      }
    } catch (error) {
      alert("Login error: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.role ||
      !registerData.center
    ) {
      alert("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.role,
        registerData.center,
      )

      if (response.success) {
        alert("Registration successful! Please login.")
        setActiveTab("login")
        setRegisterData({ name: "", email: "", password: "", role: "", center: "" })
      } else {
        alert(response.error || "Registration failed")
      }
    } catch (error) {
      alert("Registration error: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-yellow-300 opacity-70 animate-bounce">⭐</div>
        <div className="absolute top-20 right-20 text-blue-300 opacity-60 animate-pulse">📚</div>
        <div className="absolute bottom-20 left-20 text-green-300 opacity-50 animate-bounce">🏆</div>
        <div className="absolute bottom-10 right-10 text-pink-300 opacity-70 animate-pulse">✨</div>
        <div className="absolute top-1/2 left-5 text-indigo-300 opacity-40 animate-bounce">🚀</div>
        <div className="absolute top-1/3 right-5 text-yellow-300 opacity-60 animate-pulse">⭐</div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            {/* Mascot */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <div className="text-5xl">🚀</div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  ✨
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-white mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome, Young Achiever! 🌟</h1>
              <p className="text-xl md:text-2xl font-semibold mb-2 text-purple-100">
                Track Your Impact and Shine Bright!
              </p>
              <p className="text-lg text-purple-200 font-medium">Every step you take makes a difference ✨</p>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl">❤️</span>
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-bold drop-shadow-lg">ImpactScore</h2>
                <p className="text-purple-200 font-semibold">Your Learning Adventure Starts Here</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  👥
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Multi-Role Access</h3>
                <p className="text-sm text-gray-600">Students, Teachers, Parents & Admins</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  🏆
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Fun Gamification</h3>
                <p className="text-sm text-gray-600">XP Points, Badges & Leaderboards</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  📈
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Track Progress</h3>
                <p className="text-sm text-gray-600">Behavior, Academics & Attendance</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  💫
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Impact Analytics</h3>
                <p className="text-sm text-gray-600">Reports, Trends & Insights</p>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎓
                </div>
                <CardTitle className="text-2xl font-bold">Ready to Learn & Grow?</CardTitle>
                <CardDescription className="text-purple-100 text-lg font-medium">
                  Login to start your amazing journey!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {/* Tab Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`h-12 rounded-xl font-semibold text-lg transition-all ${
                      activeTab === "login"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Login 🚀
                  </button>
                  <button
                    onClick={() => setActiveTab("register")}
                    className={`h-12 rounded-xl font-semibold text-lg transition-all ${
                      activeTab === "register"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Join Us ✨
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-lg font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-lg font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-lg font-semibold text-gray-700">
                        I am a...
                      </Label>
                      <Select
                        value={loginData.role}
                        onValueChange={(value) => setLoginData({ ...loginData, role: value })}
                      >
                        <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400">
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="admin">🔧 Admin</SelectItem>
                          <SelectItem value="teacher">👩‍🏫 Teacher/Volunteer</SelectItem>
                          <SelectItem value="student">🎓 Student</SelectItem>
                          <SelectItem value="parent">👨‍👩‍👧‍👦 Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? "Logging in..." : "Let's Go! 🚀"}
                    </Button>
                  </form>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg font-semibold text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                          placeholder="Your awesome name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-lg font-semibold text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="reg-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-lg font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="reg-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="pl-12 h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                          placeholder="Create a strong password"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-role" className="text-lg font-semibold text-gray-700">
                          Role
                        </Label>
                        <Select
                          value={registerData.role}
                          onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                        >
                          <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400">
                            <SelectValue placeholder="Choose role" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="teacher">👩‍🏫 Teacher/Volunteer</SelectItem>
                            <SelectItem value="student">🎓 Student</SelectItem>
                            <SelectItem value="parent">👨‍👩‍👧‍👦 Parent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="center" className="text-lg font-semibold text-gray-700">
                          Center
                        </Label>
                        <Select
                          value={registerData.center}
                          onValueChange={(value) => setRegisterData({ ...registerData, center: value })}
                        >
                          <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400">
                            <SelectValue placeholder="Select center" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="Main Center">🏫 Main Center</SelectItem>
                            <SelectItem value="North Branch">🌟 North Branch</SelectItem>
                            <SelectItem value="South Branch">🌈 South Branch</SelectItem>
                            <SelectItem value="East Branch">🚀 East Branch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? "Creating Account..." : "Join the Adventure! ✨"}
                    </Button>
                  </form>
                )}

                {/* Demo Accounts */}
                {activeTab === "login" && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
                    <p className="text-lg font-bold mb-4 text-center text-gray-800">🎮 Try Demo Accounts:</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          🔧 Admin
                        </Badge>
                        <span className="font-mono text-gray-600 text-xs">admin@demo.com / password</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          👩‍🏫 Teacher
                        </Badge>
                        <span className="font-mono text-gray-600 text-xs">teacher@demo.com / password</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                          🎓 Student
                        </Badge>
                        <span className="font-mono text-gray-600 text-xs">student@demo.com / password</span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          👨‍👩‍👧‍👦 Parent
                        </Badge>
                        <span className="font-mono text-gray-600 text-xs">parent@demo.com / password</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto">
              <p className="text-white text-lg font-semibold mb-2">Made with ❤️ for dreamers in every school ✨</p>
              <p className="text-purple-200 font-medium">Empowering students • Building futures • Creating impact</p>
              <div className="flex justify-center gap-4 mt-4">
                <span className="text-2xl animate-bounce">🌟</span>
                <span className="text-2xl animate-pulse">📚</span>
                <span className="text-2xl animate-bounce">🚀</span>
                <span className="text-2xl animate-pulse">💫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
