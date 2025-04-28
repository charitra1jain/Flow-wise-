"use client"

import type React from "react"

import { useEffect } from "react"
import { useChat } from "@/components/chat-provider"

interface ChatEventListenerProps {
  children: React.ReactNode
}

export default function ChatEventListener({ children }: ChatEventListenerProps) {
  const { toggleChat } = useChat()

  useEffect(() => {
    // Listen for custom events to open chat with a specific question
    const handleAskChatbot = (event: CustomEvent) => {
      // Set the question in localStorage so the chatbot can pick it up
      if (event.detail?.question) {
        localStorage.setItem("flowwise_pending_question", event.detail.question)
      }

      // Open the chat
      toggleChat()
    }

    // Add event listener
    document.addEventListener("askChatbot", handleAskChatbot as EventListener)

    // Clean up
    return () => {
      document.removeEventListener("askChatbot", handleAskChatbot as EventListener)
    }
  }, [toggleChat])

  return <>{children}</>
}
