"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/context/language-context"
import { Download, Eye, FileText } from "lucide-react"

interface StudyMaterial {
  id: string
  title: string
  description: string
  category: "classNotes" | "assignments" | "referenceBooks"
  fileUrl: string
  fileName: string
  uploadedAt: string
}

export default function NotesPage() {
  const { t } = useLanguage()
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const res = await fetch(`/api/study-materials?studentId=${user.id}`)
      const data = await res.json()

      if (data.success) {
        setMaterials(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch materials:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "classNotes":
        return "📝"
      case "assignments":
        return "✏️"
      case "referenceBooks":
        return "📖"
      default:
        return "📄"
    }
  }

  const categories = ["classNotes", "assignments", "referenceBooks"] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            📚 {t("materials.studyMaterials")}
          </h1>
          <p className="text-gray-600">{t("student.studyMaterials")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <Tabs defaultValue="classNotes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto mb-8">
              <TabsTrigger value="classNotes" className="flex items-center gap-2">
                📝 {t("materials.classNotes")}
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                ✏️ {t("materials.assignments")}
              </TabsTrigger>
              <TabsTrigger value="referenceBooks" className="flex items-center gap-2">
                📖 {t("materials.referenceBooks")}
              </TabsTrigger>
            </TabsList>

            {categories.map((category) => {
              const categoryMaterials = materials.filter((m) => m.category === category)

              return (
                <TabsContent key={category} value={category}>
                  {categoryMaterials.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-gray-600">{t("materials.noMaterials")}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryMaterials.map((material) => (
                        <Card
                          key={material.id}
                          className="hover:shadow-lg transition-shadow bg-white border-2 border-gray-100"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {getCategoryIcon(material.category)} {material.title}
                                </CardTitle>
                                <CardDescription className="mt-2">{material.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                              <Badge variant="outline" className="text-xs">
                                {new Date(material.uploadedAt).toLocaleDateString()}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-transparent"
                                onClick={() => window.open(material.fileUrl, "_blank")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {t("materials.previewFile")}
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-blue-500 hover:bg-blue-600"
                                onClick={() => {
                                  const a = document.createElement("a")
                                  a.href = material.fileUrl
                                  a.download = material.fileName
                                  a.click()
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {t("materials.downloadFile")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </div>
    </div>
  )
}
