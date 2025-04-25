"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Info, Sparkles, Trash2, RotateCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { saveChatHistory, loadChatHistory, clearChatHistory, type StoredMessage } from "@/lib/chat-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  const { user } = useAuth()
  const { toast } = useToast()

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

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingText])

  // Typing animation effect
  useEffect(() => {
    if (isTyping && currentResponseIndex < messages[messages.length - 1].content.length) {
      const timer = setTimeout(() => {
        setTypingText((prev) => prev + messages[messages.length - 1].content[currentResponseIndex])
        setCurrentResponseIndex((prev) => prev + 1)
      }, 15) // Speed of typing
      return () => clearTimeout(timer)
    } else if (isTyping) {
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

  // Function to send messages to Gemini API
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
                name: user.name,
                email: user.email,
              }
            : null,
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
          <CardContent className="h-[500px] overflow-y-auto p-0">
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
                          ? "bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 border border-flowwise-mint/30 dark:border-flowwise-burgundy/20"
                          : "bg-flowwise-lightPink/20 dark:bg-flowwise-pink/10 border border-flowwise-lightPink/30 dark:border-flowwise-pink/20 text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {isTyping && index === messages.length - 1 ? typingText : message.content}
                        {isTyping && index === messages.length - 1 && (
                          <span className="inline-block w-1.5 h-4 ml-0.5 bg-flowwise-burgundy dark:bg-flowwise-pink animate-pulse"></span>
                        )}
                      </p>
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
          </CardContent>
          <CardFooter className="p-4 border-t border-flowwise-lightPink/20">
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

// Helper component for Link since we're using it in the Alert
function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>
}
