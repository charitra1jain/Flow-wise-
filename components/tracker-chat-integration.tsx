"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function TrackerChatIntegration() {
  const handleAskChatbot = (question: string) => {
    // Create a custom event to trigger the chatbot
    const event = new CustomEvent("askChatbot", {
      detail: { question },
    })
    document.dispatchEvent(event)
  }

  return (
    <Button
      variant="outline"
      className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
      onClick={() => handleAskChatbot("Can you analyze my period tracking data?")}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Ask AI Assistant
    </Button>
  )
}
