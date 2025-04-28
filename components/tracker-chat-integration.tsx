"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useChat } from "@/components/chat-provider"
import { useAuth } from "@/lib/auth-context"
import { getMostRecentLog } from "@/lib/tracker-service"

export default function TrackerChatIntegration() {
  const { toggleChat } = useChat()
  const { user } = useAuth()

  // Function to ask AI about specific symptoms
  const askAboutSymptoms = () => {
    if (!user) return

    const recentLog = getMostRecentLog(user.id)
    if (!recentLog) return

    // Create a custom event to send the question to the chatbot
    const event = new CustomEvent("askChatbot", {
      detail: {
        question: `Based on my recent log, what might be causing my ${
          recentLog.symptoms.length > 0 ? recentLog.symptoms.join(", ") : "symptoms"
        } and what can I do to manage them?`,
      },
    })
    document.dispatchEvent(event)
    toggleChat()
  }

  // Function to ask AI about cycle predictions
  const askAboutCycle = () => {
    // Create a custom event to send the question to the chatbot
    const event = new CustomEvent("askChatbot", {
      detail: {
        question: "Based on my tracking data, when is my next period likely to start and what should I expect?",
      },
    })
    document.dispatchEvent(event)
    toggleChat()
  }

  return (
    <div className="flex flex-col space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={askAboutSymptoms}
        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
      >
        <MessageCircle className="mr-2 h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
        Ask AI about my symptoms
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={askAboutCycle}
        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
      >
        <MessageCircle className="mr-2 h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
        Ask AI about my cycle
      </Button>
    </div>
  )
}
