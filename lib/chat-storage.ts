// Chat storage utility for persisting chat history
export type StoredMessage = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
}

export type ChatHistory = {
  userId: string
  messages: StoredMessage[]
  lastUpdated: string
}

// Save chat history to local storage
export const saveChatHistory = (userId: string, messages: StoredMessage[]): void => {
  if (typeof window === "undefined") return

  try {
    const history: ChatHistory = {
      userId,
      messages,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(`flowwise_chat_${userId}`, JSON.stringify(history))
  } catch (error) {
    console.error("Error saving chat history:", error)
  }
}

// Load chat history from local storage
export const loadChatHistory = (userId: string): StoredMessage[] => {
  if (typeof window === "undefined") return []

  try {
    const historyJson = localStorage.getItem(`flowwise_chat_${userId}`)
    if (!historyJson) return []

    const history: ChatHistory = JSON.parse(historyJson)
    return history.messages
  } catch (error) {
    console.error("Error loading chat history:", error)
    return []
  }
}

// Clear chat history from local storage
export const clearChatHistory = (userId: string): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(`flowwise_chat_${userId}`)
  } catch (error) {
    console.error("Error clearing chat history:", error)
  }
}
