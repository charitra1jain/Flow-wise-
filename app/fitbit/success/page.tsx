"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Check, Loader2 } from "lucide-react"
import type { FitbitTokens } from "@/lib/fitbit/fitbit-service"

export default function FitbitSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get tokens and state from URL
        const tokensParam = searchParams.get("tokens")
        const state = searchParams.get("state")

        if (!tokensParam || !state) {
          setError("Missing required parameters")
          setIsProcessing(false)
          return
        }

        // Verify state matches the one we stored (CSRF protection)
        const storedState = localStorage.getItem("fitbit_auth_state")
        const userId = localStorage.getItem("fitbit_auth_user_id")

        if (!storedState || storedState !== state || !userId) {
          setError("Invalid state parameter. This could be a CSRF attack.")
          setIsProcessing(false)
          return
        }

        // Parse tokens
        const tokens = JSON.parse(decodeURIComponent(tokensParam)) as FitbitTokens

        // Store tokens in localStorage
        localStorage.setItem(`fitbit_tokens_${userId}`, JSON.stringify(tokens))

        // Clean up
        localStorage.removeItem("fitbit_auth_state")
        localStorage.removeItem("fitbit_auth_user_id")

        // Show success toast
        toast({
          title: "Fitbit connected successfully",
          description: "Your Fitbit account has been connected to FlowWise.",
          variant: "success",
        })

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Error processing OAuth callback:", error)
        setError("Failed to process Fitbit connection")
        setIsProcessing(false)
      }
    }

    processOAuthCallback()
  }, [searchParams, router, toast])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-12">
      <Card className="w-full max-w-md border-flowwise-lightPink/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-flowwise-burgundy">Fitbit Connection</CardTitle>
          <CardDescription>
            {isProcessing
              ? "Processing your Fitbit connection..."
              : error
                ? "Connection Error"
                : "Connection Successful"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-flowwise-pink animate-spin" />
              <p className="text-muted-foreground">Finalizing your Fitbit connection...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-2xl">×</span>
              </div>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-muted-foreground">Your Fitbit account has been successfully connected!</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
