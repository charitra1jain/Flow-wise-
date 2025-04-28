"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("flowwise_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Mock login function
  const login = async (email: string, password: string) => {
    if (typeof window === "undefined") return

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${email}`,
      }

      setUser(mockUser)
      localStorage.setItem("flowwise_user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    if (typeof window === "undefined") return

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${email}`,
      }

      setUser(mockUser)
      localStorage.setItem("flowwise_user", JSON.stringify(mockUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      throw new Error("Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    if (typeof window === "undefined") return

    setUser(null)
    localStorage.removeItem("flowwise_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
