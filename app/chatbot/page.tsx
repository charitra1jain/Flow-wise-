"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Info, Sparkles, Trash2, RotateCcw, Activity, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { saveChatHistory, loadChatHistory, clearChatHistory, type StoredMessage } from "@/lib/chat-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFitbit } from "@/lib/fitbit/fitbit-context"
import { useFitbitData } from "@/lib/fitbit/use-fitbit-data"
import { Badge } from "@/components/ui/badge"
import { getMostRecentLog, getCycleStatistics } from "@/lib/tracker-service"
import Link from "next/link"
import { format } from "date-fns"
import { ChatFeedback } from "@/components/chat-feedback"

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
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const { isConnected: isFitbitConnected } = useFitbit()
  const { healthData, syncRecentData } = useFitbitData()
  const [trackerData, setTrackerData] = useState<{
    hasData: boolean
    recentLog: any
    cycleStats: any
  }>({
    hasData: false,
    recentLog: null,
    cycleStats: null,
  })
  const [userScrolled, setUserScrolled] = useState(false)

  // Add a new state for response mode
  const [responseMode, setResponseMode] = useState<"detailed" | "concise">("detailed")

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

      // Load tracker data
      const recentLog = getMostRecentLog(user.id)
      const cycleStats = getCycleStatistics(user.id)

      setTrackerData({
        hasData: !!recentLog,
        recentLog,
        cycleStats,
      })
    }
  }, [user])

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

  // Handle scroll events to detect user scrolling
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10
      setUserScrolled(!isAtBottom)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to bottom of messages only if user hasn't scrolled up
  useEffect(() => {
    if (!userScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, typingText, userScrolled])

  // Reset userScrolled when user sends a new message
  useEffect(() => {
    if (isLoading) {
      setUserScrolled(false)
    }
  }, [isLoading])

  // Typing animation effect - improved to be more stable and smoother
  useEffect(() => {
    if (!isTyping || !messages.length) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return

    if (currentResponseIndex < lastMessage.content.length) {
      const timer = setTimeout(
        () => {
          setTypingText(lastMessage.content.substring(0, currentResponseIndex + 1))
          setCurrentResponseIndex((prev) => prev + 1)

          // Randomize typing speed for more natural effect
          const speed = Math.random() * 10 + 10 // Between 10-20ms
          return () => clearTimeout(timer)
        },
        Math.random() * 10 + 10,
      ) // Random speed between 10-20ms

      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
    }
  }, [isTyping, currentResponseIndex, messages])

  // Function to clear chat history
  const handleClearChat = () => {
    if (user) {
      clearChatHistory(user.id)
    }

    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm the FlowWise AI assistant. How can I help you with menstrual health today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])

    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
      variant: "success",
    })
  }

  // Format AI response to improve structure
  const formatAIResponse = (text: string) => {
    // Add paragraph breaks for better readability
    let formattedText = text.replace(/\n\n/g, "\n\n")

    // Ensure lists are properly formatted
    formattedText = formattedText.replace(/(\d+\.\s.*?)(?=\n\d+\.|\n\n|$)/gs, "$1\n")

    // Format headings
    formattedText = formattedText.replace(/^(#+)\s+(.*?)$/gm, (_, hashes, title) => {
      return `\n${hashes} ${title}\n`
    })

    return formattedText
  }

  // Update the handleSendMessage function to include the response mode and formatting
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
    setUserScrolled(false) // Reset user scrolled state when sending a new message

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

      // Format the response for better readability
      const formattedResponse = formatAIResponse(data.response)

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Start typing animation
      setTypingText("")
      setCurrentResponseIndex(0)
      setIsTyping(true)
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

  // Sync Fitbit data if connected
  useEffect(() => {
    if (isFitbitConnected && user) {
      syncRecentData()
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
      if (trackerData.recentLog?.symptoms.includes("Bloating")) {
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

    // Return 3 random questions
    return questions.sort(() => 0.5 - Math.random()).slice(0, 3)
  }

  // Function to handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  // Helper function to format message content with proper line breaks
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
    // In a real app, you would send this to your backend
    toast({
      title: "Feedback received",
      description: `Thank you for rating this response ${rating}/5 stars.`,
      variant: "success",
    })
  }

  // Function to scroll to bottom manually
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setUserScrolled(false)
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-flowwise-mint/30 dark:bg-flowwise-burgundy/20 rounded-full">
          <Sparkles className="h-6 w-6 text-flowwise-burgundy dark:text-flowwise-pink" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl gradient-text">AI Chatbot Assistant</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Ask questions about menstrual health and get personalized answers
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {!user && (
          <Alert className="mb-6 border-flowwise-lightPink bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 dark:border-flowwise-burgundy/30">
            <Info className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
            <AlertTitle className="text-flowwise-burgundy dark:text-flowwise-pink">
              Sign in for personalized responses
            </AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Create an account or sign in to get more personalized responses based on your profile and history.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-flowwise-pink hover:bg-flowwise-pink/10">
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

        {user && !trackerData.hasData && (
          <Alert className="mb-6 border-flowwise-lightPink bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 dark:border-flowwise-burgundy/30">
            <Calendar className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
            <AlertTitle className="text-flowwise-burgundy dark:text-flowwise-pink">
              Track your symptoms for personalized insights
            </AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Start tracking your symptoms to get more personalized responses based on your menstrual cycle.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/tracker">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90"
                  >
                    Go to Tracker
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {user && !isFitbitConnected && (
          <Alert className="mb-6 border-flowwise-lightPink bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 dark:border-flowwise-burgundy/30">
            <Activity className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
            <AlertTitle className="text-flowwise-burgundy dark:text-flowwise-pink">
              Connect Fitbit for personalized insights
            </AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Connect your Fitbit account to get personalized insights based on your activity, sleep, and heart rate
                data.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/integrations">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90"
                  >
                    Connect Fitbit
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {user && trackerData.hasData && (
          <div className="mb-6">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800 mb-2"
            >
              <Calendar className="h-3 w-3 mr-1" /> Tracker Data Available
            </Badge>
            <p className="text-xs text-muted-foreground">
              Your tracked symptoms are being used to provide personalized insights. Last log:{" "}
              {format(trackerData.recentLog.date, "MMMM d, yyyy")}
            </p>
          </div>
        )}

        {user && isFitbitConnected && healthData.length > 0 && (
          <div className="mb-6">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800 mb-2"
            >
              <Activity className="h-3 w-3 mr-1" /> Fitbit Connected
            </Badge>
            <p className="text-xs text-muted-foreground">
              Your Fitbit data is being used to provide personalized insights. Last synced: {healthData[0].date}
            </p>
          </div>
        )}

        <Card className="border-flowwise-lightPink/30 shadow-lg overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-flowwise-burgundy/5 to-flowwise-pink/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-flowwise-mint dark:bg-flowwise-burgundy/30">
                  <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>FlowWise AI Assistant</CardTitle>
                  <CardDescription>Powered by Gemini AI</CardDescription>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Chat options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClearChat} className="text-red-500 focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear chat history
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="h-[500px] overflow-y-auto p-0 relative" ref={messagesContainerRef}>
            <div className="flex flex-col p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
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
                      className={`rounded-lg p-3 ${
                        message.role === "assistant"
                          ? "bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 border border-flowwise-mint/30 dark:border-flowwise-burgundy/20 animate-fade-in"
                          : "bg-flowwise-lightPink/20 dark:bg-flowwise-pink/10 border border-flowwise-lightPink/30 dark:border-flowwise-pink/20 text-foreground"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {isTyping && index === messages.length - 1
                          ? formatMessageContent(typingText)
                          : formatMessageContent(message.content)}
                        {isTyping && index === messages.length - 1 && (
                          <span className="inline-block w-1.5 h-4 ml-0.5 bg-flowwise-burgundy dark:bg-flowwise-pink animate-pulse"></span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground mt-1">
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
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-flowwise-mint dark:bg-flowwise-burgundy/30">
                      <Bot className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 border border-flowwise-mint/30 dark:border-flowwise-burgundy/20">
                      <div className="flex items-center space-x-2">
                        <div className="typing-animation">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button - only visible when user has scrolled up */}
            {userScrolled && (
              <Button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 rounded-full shadow-lg bg-flowwise-burgundy hover:bg-flowwise-red"
                size="icon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <span className="sr-only">Scroll to bottom</span>
              </Button>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t border-flowwise-lightPink/20 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Response mode:</span>
                <div className="flex items-center space-x-1 bg-muted rounded-full p-1">
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
            <div className="flex flex-wrap gap-2">
              {getSuggestedQuestions().map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 text-sm"
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
                className="flex-1 border-flowwise-lightPink/50 focus-visible:ring-flowwise-pink"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>The AI assistant provides general information and is not a substitute for professional medical advice.</p>
          <p>Always consult with a healthcare provider for medical concerns.</p>
        </div>
      </div>
    </div>
  )
}
