"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import PopupChatbot from "@/components/popup-chatbot"

type ChatContextType = {
  showChatButton: boolean
  setShowChatButton: (show: boolean) => void
  toggleChat: () => void
  isOpen: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [showChatButton, setShowChatButton] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ChatContext.Provider value={{ showChatButton, setShowChatButton, toggleChat, isOpen }}>
      {children}
      {showChatButton && <PopupChatbot />}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

// Hook to hide chat button on specific pages
export function useChatVisibility(shouldShow: boolean) {
  const { setShowChatButton } = useChat(true)

  useEffect(() => {
    setShowChatButton(shouldShow)
    return () => {
      setShowChatButton(true) // Reset to default when component unmounts
    }
  }, [shouldShow, setShowChatButton])
}
