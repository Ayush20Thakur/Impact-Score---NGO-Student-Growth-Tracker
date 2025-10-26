"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, X, MessageCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AIStudyBuddyProps {
  studentId: string
}

export function AIStudyBuddy({ studentId }: AIStudyBuddyProps) {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch chat history on open
  useEffect(() => {
    if (isOpen) {
      fetchChatHistory()
    }
  }, [isOpen])

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`/api/ai-chat?studentId=${studentId}`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)

    try {
      // Add user message optimistically
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput("")

      // Send to API
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, message: input, language }),
      })

      const data = await res.json()

      if (data.success) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data.aiResponse,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center text-2xl animate-bounce"
        title={t("ai.studyBuddy")}
      >
        🤖
      </button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-40 w-96 max-h-96 shadow-2xl rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold">{t("ai.studyBuddy")}</h3>
            <p className="text-sm text-purple-100">{t("ai.askQuestion")}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="h-64 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("ai.askQuestion")}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{t("ai.typing")}</span>
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ai.placeholder")}
          className="text-sm rounded-full"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !input.trim()}
          className="bg-purple-500 hover:bg-purple-600 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
