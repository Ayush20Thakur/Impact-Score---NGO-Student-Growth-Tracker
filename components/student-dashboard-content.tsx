"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Calendar, LogOut, Trophy, Zap, Target, Users, Sparkles, Video, FileText, Clock } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { AIStudyBuddy } from "@/components/ai-study-buddy"
import { useLanguage } from "@/context/language-context"

interface StudentDashboardContentProps {
  user: any
}

export default function StudentDashboardContent({ user }: StudentDashboardContentProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [studentData, setStudentData] = useState({
    name: "Loading...",
    level: 1,
    xp: 0,
    nextLevelXP: 1500,
    totalBadges: 0,
    streak: 0,
    rank: 0,
    badges: [] as any[],
    goals: [] as any[],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [schedules, setSchedules] = useState<any[]>([])
  const [loadingSchedules, setLoadingSchedules] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchStudentData()
    fetchSchedules()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Get student ID from user object
      const studentId = user?.id || "s1"

      const response = await fetch(`/api/students/get-data?studentId=${studentId}`)
      const result = await response.json()

      if (result.success) {
        setStudentData(result.data)
      } else {
        console.error("Failed to fetch student data:", result.error)
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSchedules = async () => {
    setLoadingSchedules(true)
    try {
      const studentId = user?.id || "s1"
      const response = await fetch(`/api/schedules?studentId=${studentId}`)
      const result = await response.json()

      if (result.success) {
        setSchedules(result.data)
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

  const progressToNext = (studentData.xp / studentData.nextLevelXP) * 100

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hand-drawn-doodle-background_23-2149968652-gX16QQHWo19KpJxguAu8gbDATfSBg0.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Sparkles className="h-8 w-8" />
                  {t("navbar.myLearning")}
                </h1>
                <p className="text-purple-100 text-lg">{t("student.welcomeBack")}, {studentData.name}! 🎉</p>
              </div>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                  {t("student.levelStudent").replace("{level}", studentData.level.toString())}
                </Badge>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("common.logout")}
                </Button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={() => router.push("/student/schedule")}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t("navbar.schedule")}
              </Button>
              <Button
                onClick={() => router.push("/student/live-classes")}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Video className="h-4 w-4 mr-2" />
                {t("navbar.liveClasses")}
              </Button>
              <Button
                onClick={() => router.push("/student/notes")}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("navbar.notes")}
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl transform hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-lg">{t("student.currentLevel")}</p>
                    <p className="text-4xl font-bold">{studentData.level}</p>
                  </div>
                  <div className="text-6xl">🌟</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl transform hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-lg">{t("student.totalXP")}</p>
                    <p className="text-4xl font-bold">{studentData.xp}</p>
                  </div>
                  <div className="text-6xl">⚡</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-xl transform hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-lg">{t("student.badgesEarned")}</p>
                    <p className="text-4xl font-bold">{studentData.totalBadges}</p>
                  </div>
                  <div className="text-6xl">🏆</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-xl transform hover:scale-105 transition-transform">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-lg">{t("student.currentStreak")}</p>
                    <p className="text-4xl font-bold">{studentData.streak}</p>
                  </div>
                  <div className="text-6xl">🔥</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
                {t("student.levelProgress")} 🚀
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>🌟 {t("student.currentLevel")} {studentData.level}</span>
                  <span>⭐ {t("student.currentLevel")} {studentData.level + 1}</span>
                </div>
                <div className="relative">
                  <Progress value={progressToNext} className="h-6 bg-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                      {Math.round(progressToNext)}% {t("student.complete")}
                    </span>
                  </div>
                </div>
                <p className="text-center text-lg font-semibold text-gray-700">
                  {studentData.xp} / {studentData.nextLevelXP} XP
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="overview">🏠 {t("student.overview")}</TabsTrigger>
              <TabsTrigger value="badges">🏆 {t("student.badges")}</TabsTrigger>
              <TabsTrigger value="goals">🎯 {t("student.goals")}</TabsTrigger>
              <TabsTrigger value="schedule">📅 Schedule</TabsTrigger>
              <TabsTrigger value="leaderboard">👑 {t("student.leaderboard")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Zap className="h-6 w-6 text-yellow-500" />
                      {t("student.recentAdventures")} 🌟
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { activity: t("student.completedMathHomework"), xp: 25, emoji: "📝" },
                        { activity: t("student.perfectAttendance"), xp: 50, emoji: "✅" },
                        { activity: t("student.helpedClassmate"), xp: 30, emoji: "🤝" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <p className="font-semibold">{item.activity}</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">+{item.xp} XP</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-6 w-6 text-green-500" />
                      {t("student.weeklyPerformance")} 📈
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: `✅ ${t("student.attendance")}`, value: 100 },
                      { label: `📝 ${t("student.homework")}`, value: 85 },
                      { label: `😊 ${t("student.behavior")}`, value: 95 },
                      { label: `🙋 ${t("student.participation")}`, value: 90 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="text-lg font-semibold">{item.label}</span>
                          <span className="text-lg font-bold text-green-600">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-4" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="badges">
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    {t("student.myBadgeCollection")} 🏆
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center text-gray-500">Loading badges...</p>
                  ) : studentData.badges.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No badges earned yet. Keep working hard! 💪</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {studentData.badges.map((badge, i) => (
                        <div
                          key={i}
                          className="border-2 border-yellow-300 rounded-xl p-6 text-center space-y-4 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-shadow transform hover:scale-105"
                        >
                          <div className="text-6xl">{badge.icon}</div>
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-yellow-200 text-yellow-800">
                            {badge.name}
                          </div>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                          <p className="text-xs text-gray-500">
                            Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals">
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Target className="h-8 w-8 text-green-500" />
                    {t("student.myLearningGoals")} 🎯
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center text-gray-500">Loading goals...</p>
                  ) : studentData.goals.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No goals set yet. Your teacher will set goals for you! 🎯</p>
                  ) : (
                    <div className="space-y-6">
                      {studentData.goals.map((item, i) => (
                        <div
                          key={i}
                          className="border-2 border-green-200 rounded-xl p-6 space-y-4 bg-gradient-to-r from-green-50 to-blue-50"
                        >
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-600">{item.description}</p>
                          )}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-lg font-semibold">{t("student.progress")}</span>
                              <span className="text-lg font-bold text-green-600">{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-4" />
                          </div>
                          <p className="text-sm text-gray-500">
                            Deadline: {new Date(item.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    My Schedule/Timetable 📅
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSchedules ? (
                    <p className="text-center text-gray-500">Loading schedule...</p>
                  ) : schedules.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No schedule set yet. Your teacher will create one for you! 📚</p>
                  ) : (
                    <div className="space-y-4">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, dayIndex) => {
                        const daySchedules = schedules.filter(s => s.dayOfWeek === (dayIndex + 1) % 7)

                        if (daySchedules.length === 0) return null

                        return (
                          <div key={day} className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              {day}
                            </h3>
                            <div className="space-y-2">
                              {daySchedules.map((schedule) => (
                                <div key={schedule.id} className="bg-white rounded-lg p-3 border border-blue-100">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-lg text-blue-700">{schedule.subject}</h4>
                                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Clock className="h-4 w-4" />
                                        {schedule.startTime} - {schedule.endTime}
                                      </p>
                                      {schedule.room && (
                                        <p className="text-sm text-gray-600 mt-1">📍 {schedule.room}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Users className="h-8 w-8 text-purple-500" />
                    {t("student.classChampions")} 👑
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: "Rahul Kumar", xp: 1380, avatar: "🦸‍♂️" },
                      { rank: 2, name: "Anita Singh", xp: 1290, avatar: "🌟" },
                      { rank: 3, name: "Priya Sharma", xp: 1250, avatar: "🎨" },
                    ].map((student) => (
                      <div
                        key={student.rank}
                        className={`flex items-center justify-between p-6 rounded-xl ${
                          student.name === "Priya Sharma"
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-300 transform scale-105"
                            : "bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                            #{student.rank}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{student.avatar}</span>
                            <p className="text-xl font-bold">{student.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">{student.xp} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Study Buddy */}
      <AIStudyBuddy studentId={user?.id || "s1"} />
    </div>
  )
}
