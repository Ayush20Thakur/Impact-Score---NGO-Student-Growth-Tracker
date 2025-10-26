"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"
import { ExternalLink, Clock } from "lucide-react"

interface LiveClass {
  id: string
  title: string
  description: string
  googleMeetLink: string
  scheduledTime: string
  teacher: string
}

export default function LiveClassesPage() {
  const { t } = useLanguage()
  const [classes, setClasses] = useState<LiveClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLiveClasses()
  }, [])

  const fetchLiveClasses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch(`/api/live-classes?studentId=${user.id}`)
      const data = await res.json()

      if (data.success) {
        const transformed = data.data.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          googleMeetLink: c.googleMeetLink,
          scheduledTime: c.scheduledTime,
          teacher: "Ms. Patel",
        }))
        setClasses(transformed)
      }
    } catch (error) {
      console.error("Failed to fetch live classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const isUpcoming = (time: string) => new Date(time) > new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🎥 {t("student.liveClasses")}
          </h1>
          <p className="text-gray-600">{t("student.upcomingClasses")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : classes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">No live classes scheduled yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <Card
                key={cls.id}
                className={`overflow-hidden border-2 ${
                  isUpcoming(cls.scheduledTime)
                    ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                    : "border-gray-300"
                }`}
              >
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{cls.title}</CardTitle>
                      <CardDescription className="text-purple-100 mt-1">{cls.description}</CardDescription>
                    </div>
                    {isUpcoming(cls.scheduledTime) && (
                      <Badge className="bg-green-400 text-green-900">📡 Live Soon</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="h-5 w-5 text-purple-500" />
                      <span>{new Date(cls.scheduledTime).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <span className="text-lg">👨‍🏫</span>
                      <span>{cls.teacher}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => window.open(cls.googleMeetLink, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("student.joinClass")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
