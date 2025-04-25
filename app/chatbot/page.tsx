"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm the FlowWise AI assistant. How can I help you with menstrual health today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Placeholder function for sending messages
  // In a real implementation, this would connect to the Gemini API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Add assistant response (placeholder)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getPlaceholderResponse(userMessage.content),
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  // Placeholder function to generate responses
  // This would be replaced with actual Gemini API integration
  const getPlaceholderResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("period") && lowerQuery.includes("normal")) {
      return "A typical menstrual cycle lasts 28 days, but can range from 21 to 35 days. The period itself usually lasts 3-7 days. However, everyone's body is different, and what's normal varies from person to person."
    } else if (lowerQuery.includes("pain") || lowerQuery.includes("cramp")) {
      return "Menstrual cramps are common and can range from mild to severe. Some remedies include heat therapy, gentle exercise, staying hydrated, and over-the-counter pain relievers. If your pain is severe or disrupts daily activities, it's a good idea to consult a healthcare provider."
    } else if (lowerQuery.includes("product") || lowerQuery.includes("pad") || lowerQuery.includes("tampon")) {
      return "There are many menstrual products available, including pads, tampons, menstrual cups, period underwear, and reusable cloth pads. Each has its own benefits, and the best choice depends on your personal preference, lifestyle, and comfort level."
    } else {
      return "That's a great question about menstrual health. In a fully implemented version, I would connect to the Gemini AI to provide you with accurate and helpful information. Is there something specific about menstrual health you'd like to learn more about?"
    }
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          AI Chatbot Assistant
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Ask questions about menstrual health and get personalized answers
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Alert className="mb-6 border-pink-200 dark:border-pink-900 bg-pink-50 dark:bg-pink-950/20">
          <Info className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          <AlertTitle className="text-pink-600 dark:text-pink-400">Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demo of the AI chatbot. In the full version, this would connect to the Gemini API for accurate
            responses.
          </AlertDescription>
        </Alert>

        <Card className="border-pink-100 dark:border-pink-900/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              FlowWise AI Assistant
            </CardTitle>
            <CardDescription>Ask me anything about menstrual health and wellness</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-y-auto pb-0">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.role === "assistant" ? "bg-pink-100 dark:bg-pink-900" : ""}>
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "assistant" ? "bg-muted" : "bg-pink-100 dark:bg-pink-900/50 text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-pink-100 dark:bg-pink-900">
                      <Bot className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
