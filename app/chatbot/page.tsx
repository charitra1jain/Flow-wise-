"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  Bot,
  User,
  Info,
  Sparkles,
  Trash2,
  RotateCcw,
  Activity,
  Calendar,
  Plus,
  Menu,
  ArrowDown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { saveChatHistory, loadChatHistory, clearChatHistory, type StoredMessage } from "@/lib/chat-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getMostRecentLog, getCycleStatistics } from "@/lib/tracker-service"
import Link from "next/link"
import { ChatFeedback } from "@/components/chat-feedback"
import { useAuth } from "@/lib/auth-context"
import { useFitbit } from "@/lib/fitbit/fitbit-context"
import { useFitbitData } from "@/lib/fitbit/use-fitbit-data"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const useSafeAuth = () => {
  try {
    return useAuth()
  } catch (error) {
    console.warn("Auth context not available:", error)
    return { user: null, isLoading: false }
  }
}

const useSafeFitbit = () => {
  try {
    return useFitbit()
  } catch (error) {
    console.warn("Fitbit context not available:", error)
    return { isConnected: false }
  }
}

const useSafeFitbitData = () => {
  try {
    return useFitbitData()
  } catch (error) {
    console.warn("Fitbit data context not available:", error)
    return { healthData: [], syncRecentData: () => {} }
  }
}

export default function ChatbotPage() {
  const { user, isLoading: authLoading } = useSafeAuth()
  const { toast } = useToast()
  const { isConnected: isFitbitConnected } = useSafeFitbit()
  const { healthData, syncRecentData } = useSafeFitbitData()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [userScrolled, setUserScrolled] = useState(false)

  const [trackerData, setTrackerData] = useState<{
    hasData: boolean
    recentLog: any
    cycleStats: any
  }>({
    hasData: false,
    recentLog: null,
    cycleStats: null,
  })
  const [responseMode, setResponseMode] = useState<"detailed" | "concise">("detailed")

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      try {
        const storedMessages = loadChatHistory(user.id)
        if (storedMessages && storedMessages.length > 0) {
          const parsedMessages: Message[] = storedMessages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
          setMessages(parsedMessages)
        }

        // Load tracker data
        const recentLog = getMostRecentLog(user.id)
        const cycleStats = getCycleStatistics(user.id)

        setTrackerData({
          hasData: !!recentLog,
          recentLog,
          cycleStats,
        })
      } catch (error) {
        console.warn("Error loading user data:", error)
      }
    }
  }, [user])

  // Save chat history when messages change
  useEffect(() => {
    if (user && messages.length > 0) {
      try {
        const storedMessages: StoredMessage[] = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }))
        saveChatHistory(user.id, storedMessages)
      } catch (error) {
        console.warn("Error saving chat history:", error)
      }
    }
  }, [messages, user])

  // Monitor scroll position
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50
      setUserScrolled(!isAtBottom)
      setShowScrollButton(!isAtBottom && messages.length > 0)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [messages.length])

  // Only auto-scroll if user hasn't manually scrolled up
  useEffect(() => {
    if (!userScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typingText, userScrolled])

  // Typing animation effect
  useEffect(() => {
    if (!isTyping || !messages.length) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return

    if (currentResponseIndex < lastMessage.content.length) {
      const timer = setTimeout(
        () => {
          setTypingText(lastMessage.content.substring(0, currentResponseIndex + 1))
          setCurrentResponseIndex((prev) => prev + 1)
        },
        Math.random() * 11 + 11,
      )

      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [isTyping, currentResponseIndex, messages])

  // Function to clear chat history
  const handleClearChat = () => {
    if (user) {
      try {
        clearChatHistory(user.id)
      } catch (error) {
        console.warn("Error clearing chat history:", error)
      }
    }

    setMessages([])
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
      variant: "success",
    })
  }

  // Format AI response to improve structure
  const formatAIResponse = (text: string) => {
    let formattedText = text.replace(/\n\n/g, "\n\n")
    formattedText = formattedText.replace(/(\d+\.\s.*?)(?=\n\d+\.|\n\n|$)/gs, "$1\n")
    formattedText = formattedText.replace(/^(#+)\s+(.*?)$/gm, (_, hashes, title) => {
      return `\n${hashes} ${title}\n`
    })
    return formattedText
  }

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setUserScrolled(false) // Allow auto-scroll for new messages

    try {
      const mostRecentData = healthData.length > 0 ? healthData[0] : null

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
          responseMode: responseMode,
        }),
      })

      // Check if response is ok first
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
          } else {
            const errorText = await response.text()
            errorMessage = errorText.substring(0, 200)
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response received:", responseText.substring(0, 500))
        throw new Error("Server returned non-JSON response. Please try again.")
      }

      const data = await response.json()

      if (!data.response) {
        throw new Error("Invalid response format from AI service")
      }

      const formattedResponse = formatAIResponse(data.response)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      setTypingText("")
      setCurrentResponseIndex(0)
      setIsTyping(true)
    } catch (error) {
      console.error("Error getting AI response:", error)

      let errorMessage = "Failed to get a response from the AI assistant. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (error.message.includes("HTTP 500")) {
          errorMessage = "Server error. The AI service is temporarily unavailable."
        } else if (error.message.includes("HTTP 429")) {
          errorMessage = "Too many requests. Please wait a moment and try again."
        } else if (error.message.includes("non-JSON response")) {
          errorMessage = "Server configuration error. Please try again later."
        } else if (error.message.length < 200) {
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      const errorResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I encountered an error. Please try again later or contact support if the problem persists.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponseMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Sync Fitbit data if connected
  useEffect(() => {
    if (isFitbitConnected && user && syncRecentData) {
      try {
        syncRecentData()
      } catch (error) {
        console.warn("Error syncing Fitbit data:", error)
      }
    }
  }, [isFitbitConnected, user, syncRecentData])

  // Helper function to get suggested questions based on user data
  const getSuggestedQuestions = () => {
    const questions = [
      "What causes menstrual cramps?",
      "How can I manage PMS symptoms?",
      "What are the different types of period products?",
    ]

    if (trackerData.hasData) {
      if (trackerData.recentLog?.pain > 5) {
        questions.push("What can help with severe period pain?")
      }
      if (trackerData.recentLog?.symptoms?.includes("Bloating")) {
        questions.push("How can I reduce bloating during my period?")
      }
      if (trackerData.cycleStats?.hasEnoughData) {
        questions.push(`When is my next period likely to start?`)
      }
    }

    if (isFitbitConnected && healthData.length > 0) {
      questions.push("How does my sleep affect my menstrual cycle?")
      questions.push("How should I adjust my exercise during different cycle phases?")
    }

    return questions.sort(() => 0.5 - Math.random()).slice(0, 3)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const formatMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  const handleFeedbackSubmit = (messageId: string, rating: number, feedback?: string) => {
    console.log(`Feedback for message ${messageId}: ${rating}/5 stars`, feedback)
    toast({
      title: "Feedback received",
      description: `Thank you for rating this response ${rating}/5 stars.`,
      variant: "success",
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setUserScrolled(false)
  }

  const startNewChat = () => {
    setMessages([])
    setInput("")
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-flowwise-mint/30 dark:bg-flowwise-burgundy/20 rounded-full">
            <Sparkles className="h-6 w-6 text-flowwise-burgundy dark:text-flowwise-pink animate-spin" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Loading...</h1>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">Initializing AI Chatbot Assistant</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2">FlowWise</h3>
            <div className="space-y-1">
              <Link href="/tracker" className="block p-2 rounded hover:bg-gray-700 text-sm">
                Symptom Tracker
              </Link>
              <Link href="/learn" className="block p-2 rounded hover:bg-gray-700 text-sm">
                Educational Content
              </Link>
              <Link href="/integrations" className="block p-2 rounded hover:bg-gray-700 text-sm">
                Integrations
              </Link>
            </div>
          </div>

          {user && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
              <div className="space-y-2">
                {trackerData.hasData && (
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    Tracker Active
                  </Badge>
                )}
                {isFitbitConnected && (
                  <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-700">
                    <Activity className="h-3 w-3 mr-1" />
                    Fitbit Connected
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
                <RotateCcw className="mr-2 h-4 w-4" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem onClick={handleClearChat} className="text-red-400 focus:text-red-300">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear chat history
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">FlowWise AI</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            // Welcome screen
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-flowwise-burgundy/20 to-flowwise-pink/20 rounded-full mb-6">
                  <Bot className="h-8 w-8 text-flowwise-pink" />
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-flowwise-burgundy to-flowwise-pink bg-clip-text text-transparent">
                  Hello, {user?.name || "there"}
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  I'm your FlowWise AI assistant. How can I help you with menstrual health today?
                </p>

                {/* Status alerts */}
                <div className="space-y-3 mb-8">
                  {!user && (
                    <Alert className="border-flowwise-lightPink bg-flowwise-mint/10 border-flowwise-burgundy/30">
                      <Info className="h-4 w-4 text-flowwise-pink" />
                      <AlertTitle className="text-flowwise-pink">Sign in for personalized responses</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2 text-gray-300">
                          Create an account or sign in to get more personalized responses.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Link href="/login">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-flowwise-pink hover:bg-flowwise-pink/10"
                            >
                              Sign in
                            </Button>
                          </Link>
                          <Link href="/signup">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90"
                            >
                              Create account
                            </Button>
                          </Link>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Suggested questions */}
                <div className="grid gap-3 max-w-md mx-auto">
                  {getSuggestedQuestions().map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="border-gray-600 hover:bg-gray-700 text-left justify-start h-auto p-4 whitespace-normal"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="flex-1 overflow-y-auto px-4 py-6 relative" ref={messagesContainerRef}>
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar
                        className={
                          message.role === "assistant"
                            ? "bg-flowwise-mint dark:bg-flowwise-burgundy/30"
                            : "bg-flowwise-lightPink/20"
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
                        className={`rounded-lg p-4 ${
                          message.role === "assistant"
                            ? "bg-gray-800 border border-gray-700"
                            : "bg-flowwise-burgundy/20 border border-flowwise-burgundy/30"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {isTyping && index === messages.length - 1
                            ? formatMessageContent(typingText)
                            : formatMessageContent(message.content)}
                          {isTyping && index === messages.length - 1 && (
                            <span className="inline-block w-1.5 h-4 ml-0.5 bg-flowwise-pink animate-pulse"></span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {message.role === "assistant" && !isTyping && index === messages.length - 1 && (
                            <ChatFeedback messageId={message.id} onFeedbackSubmit={handleFeedbackSubmit} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="bg-flowwise-mint dark:bg-flowwise-burgundy/30">
                        <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-4 bg-gray-800 border border-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-flowwise-pink rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-flowwise-pink rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-flowwise-pink rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              {showScrollButton && (
                <Button
                  onClick={scrollToBottom}
                  className="fixed bottom-24 right-8 rounded-full shadow-lg bg-gray-700 hover:bg-gray-600 border border-gray-600"
                  size="icon"
                >
                  <ArrowDown className="h-4 w-4" />
                  <span className="sr-only">Scroll to bottom</span>
                </Button>
              )}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-gray-700 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Response mode:</span>
                  <div className="flex items-center space-x-1 bg-gray-800 rounded-full p-1">
                    <Button
                      variant={responseMode === "concise" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-full h-7 px-3 text-xs"
                      onClick={() => setResponseMode("concise")}
                    >
                      Concise
                    </Button>
                    <Button
                      variant={responseMode === "detailed" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded-full h-7 px-3 text-xs"
                      onClick={() => setResponseMode("detailed")}
                    >
                      Detailed
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <Input
                  placeholder="Ask FlowWise..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pr-12 bg-gray-800 border-gray-600 focus-visible:ring-flowwise-pink text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 bg-flowwise-burgundy hover:bg-flowwise-red"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>

              <div className="mt-3 text-center text-xs text-gray-500">
                <p>FlowWise AI provides general information and is not a substitute for professional medical advice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
