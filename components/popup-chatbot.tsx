"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, X, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { saveChatHistory, loadChatHistory, type StoredMessage } from "@/lib/chat-storage"
import { useFitbit } from "@/lib/fitbit/fitbit-context"
import { useFitbitData } from "@/lib/fitbit/use-fitbit-data"
import { cn } from "@/lib/utils"
import { useChat } from "@/components/chat-provider"
import { getPersonalizedQuestions } from "@/lib/tracker-chat-service"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function PopupChatbot() {
  const { isOpen, toggleChat } = useChat()
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
  const { user } = useAuth()
  const { toast } = useToast()
  const { isConnected: isFitbitConnected } = useFitbit()
  const { healthData } = useFitbitData()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What causes menstrual cramps?",
    "How can I manage PMS symptoms?",
    "What are the different types of period products?",
  ])

  // Add a new state for response mode
  const [responseMode, setResponseMode] = useState<"detailed" | "concise">("concise")

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      const storedMessages = loadChatHistory(user.id)
      if (storedMessages && storedMessages.length > 0) {
        const parsedMessages: Message[] = storedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(parsedMessages)
      }

      // Generate personalized suggested questions
      const personalizedQuestions = getPersonalizedQuestions(user.id)
      if (personalizedQuestions.length > 0) {
        setSuggestedQuestions(personalizedQuestions)
      }
    }
  }, [user])

  // Check for pending questions when the chat opens
  useEffect(() => {
    if (isOpen) {
      const pendingQuestion = localStorage.getItem("flowwise_pending_question")
      if (pendingQuestion) {
        // Set the input and clear the pending question
        setInput(pendingQuestion)
        localStorage.removeItem("flowwise_pending_question")
      }
    }
  }, [isOpen])

  // Save chat history when messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      const storedMessages: StoredMessage[] = messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      }))
      saveChatHistory(user.id, storedMessages)
    }
  }, [messages, user])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update the handleSendMessage function to include the response mode
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

    try {
      // Get most recent Fitbit data if connected
      const mostRecentData = healthData.length > 0 ? healthData[0] : null

      // Call the Gemini API through our server action
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
          fitbitData: isFitbitConnected ? mostRecentData : null,
          responseMode: responseMode, // Add response mode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API error:", data)
        throw new Error(data.error || "Failed to get response from AI")
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant. Please try again.",
        variant: "destructive",
      })

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error connecting to the AI service. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        toggleChat()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, toggleChat])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div
          ref={chatContainerRef}
          className="w-80 sm:w-96 h-[500px] flex flex-col bg-white dark:bg-gray-950 rounded-lg shadow-lg border border-pink-100 dark:border-pink-900/50 animate-in slide-in-from-bottom-5 duration-300"
        >
          <CardHeader className="py-3 px-4 border-b border-pink-100 dark:border-pink-900/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-flowwise-mint dark:bg-flowwise-burgundy/30">
                <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">FlowWise Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar
                    className={
                      message.role === "assistant"
                        ? "h-8 w-8 bg-flowwise-mint dark:bg-flowwise-burgundy/30"
                        : "h-8 w-8 bg-flowwise-lightPink/20"
                    }
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                    ) : (
                      <User className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                    )}
                    <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-3 text-sm",
                      message.role === "assistant"
                        ? "bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 border border-flowwise-mint/30 dark:border-flowwise-burgundy/20"
                        : "bg-flowwise-lightPink/20 dark:bg-flowwise-pink/10 border border-flowwise-lightPink/30 dark:border-flowwise-pink/20",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-flowwise-mint dark:bg-flowwise-burgundy/30">
                    <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 border border-flowwise-mint/30 dark:border-flowwise-burgundy/20">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 border-t border-pink-100 dark:border-pink-900/50 flex flex-col gap-2">
            <div className="flex justify-end items-center w-full mb-2">
              <div className="flex items-center space-x-1 bg-muted rounded-full p-1">
                <Button
                  variant={responseMode === "concise" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full h-6 px-2 text-xs"
                  onClick={() => setResponseMode("concise")}
                >
                  Concise
                </Button>
                <Button
                  variant={responseMode === "detailed" ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full h-6 px-2 text-xs"
                  onClick={() => setResponseMode("detailed")}
                >
                  Detailed
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                >
                  {question}
                </Button>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border-pink-100 focus-visible:ring-pink-500 dark:border-pink-900/50"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-pink-600 hover:bg-pink-700"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-pink-600 hover:bg-pink-700 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      )}
    </div>
  )
}
