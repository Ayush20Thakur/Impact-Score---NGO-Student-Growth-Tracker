"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

interface ScheduleItem {
  id: string
  subject: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string
  teacher: string
}

const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

export default function SchedulePage() {
  const { t, language } = useLanguage()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch(`/api/schedule?studentId=${user.id}`)
      const data = await res.json()

      if (data.success) {
        // Transform data for display
        const transformed = data.data.map((s: any) => ({
          id: s.id,
          subject: s.subject,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
          teacher: "Ms. Patel", // From teacher name
        }))
        setSchedule(transformed)
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedByDay = daysOfWeek.map((day, index) => ({
    day,
    dayIndex: index,
    classes: schedule.filter((s) => s.dayOfWeek === index),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            📚 {t("schedule.mySchedule")}
          </h1>
          <p className="text-gray-600">{t("student.mySchedule")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedByDay.map((dayGroup) => (
              <Card key={dayGroup.day} className="bg-white hover:shadow-lg transition-shadow border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {dayGroup.dayIndex === 0 ? "☀️" : dayGroup.dayIndex === 6 ? "⭐" : "📖"}
                    {" " + t(`schedule.${dayGroup.day}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dayGroup.classes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No classes scheduled</p>
                  ) : (
                    <div className="space-y-4">
                      {dayGroup.classes.map((cls) => (
                        <div key={cls.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <h3 className="font-bold text-gray-900">{cls.subject}</h3>
                          <div className="space-y-2 mt-2 text-sm text-gray-600">
                            <p>
                              🕐 {cls.startTime} - {cls.endTime}
                            </p>
                            <p>📍 {cls.room}</p>
                            <p>👨‍🏫 {cls.teacher}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
