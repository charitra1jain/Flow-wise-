"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function FitbitConnectButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      setIsLoading(true)

      // Call our API endpoint to get the authorization URL
      const response = await fetch("/api/fitbit/authorize")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate authorization URL")
      }

      // Redirect to the authorization URL
      window.location.href = data.authUrl
    } catch (error) {
      console.error("Error connecting to Fitbit:", error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to Fitbit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading} className="bg-[#00B0B9] hover:bg-[#00B0B9]/90">
      {isLoading ? "Connecting..." : "Connect Fitbit"}
    </Button>
  )
}
