"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { type FitbitTokens, getFitbitProfile } from "./fitbit-service"

interface FitbitContextType {
  isConnected: boolean
  isLoading: boolean
  connectFitbit: () => void
  disconnectFitbit: () => void
  fitbitTokens: FitbitTokens | null
  fitbitUserProfile: any | null
  updateTokens: (tokens: FitbitTokens) => void
}

const FitbitContext = createContext<FitbitContextType | undefined>(undefined)

export function FitbitProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fitbitTokens, setFitbitTokens] = useState<FitbitTokens | null>(null)
  const [fitbitUserProfile, setFitbitUserProfile] = useState<any | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load Fitbit tokens from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    if (user) {
      try {
        const storedTokens = localStorage.getItem(`fitbit_tokens_${user.id}`)
        if (storedTokens) {
          const tokens = JSON.parse(storedTokens) as FitbitTokens

          // Check if tokens are expired
          if (tokens.expires_at > Date.now()) {
            setFitbitTokens(tokens)
            setIsConnected(true)

            // Fetch user profile
            getFitbitProfile(tokens, updateTokens)
              .then((profile) => {
                setFitbitUserProfile(profile)
              })
              .catch((error) => {
                console.error("Error fetching Fitbit profile:", error)
                // If we can't fetch the profile, tokens might be invalid
                disconnectFitbit()
              })
          } else {
            // Tokens expired, remove them
            localStorage.removeItem(`fitbit_tokens_${user.id}`)
          }
        }
      } catch (error) {
        console.error("Error loading Fitbit tokens:", error)
      }

      setIsLoading(false)
    }
  }, [user])

  // Function to initiate Fitbit connection
  const connectFitbit = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your Fitbit account.",
        variant: "destructive",
      })
      return
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)

    if (typeof window !== "undefined") {
      localStorage.setItem("fitbit_auth_state", state)
      localStorage.setItem("fitbit_auth_user_id", user.id)
    }

    // Redirect to Fitbit authorization page via our API route
    window.location.href = `/api/fitbit/authorize?state=${state}`
  }

  // Function to disconnect Fitbit
  const disconnectFitbit = () => {
    if (user) {
      localStorage.removeItem(`fitbit_tokens_${user.id}`)
      setFitbitTokens(null)
      setFitbitUserProfile(null)
      setIsConnected(false)

      toast({
        title: "Fitbit disconnected",
        description: "Your Fitbit account has been disconnected successfully.",
      })
    }
  }

  // Function to update tokens (used after refresh)
  const updateTokens = async (tokens: FitbitTokens) => {
    if (user) {
      setFitbitTokens(tokens)
      localStorage.setItem(`fitbit_tokens_${user.id}`, JSON.stringify(tokens))
    }
  }

  return (
    <FitbitContext.Provider
      value={{
        isConnected,
        isLoading,
        connectFitbit,
        disconnectFitbit,
        fitbitTokens,
        fitbitUserProfile,
        updateTokens,
      }}
    >
      {children}
    </FitbitContext.Provider>
  )
}

export function useFitbit() {
  const context = useContext(FitbitContext)
  if (context === undefined) {
    throw new Error("useFitbit must be used within a FitbitProvider")
  }
  return context
}
