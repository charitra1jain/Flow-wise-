"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFitbit } from "@/lib/fitbit/fitbit-context"
import { FitbitConnectButton } from "./fitbit-connect-button"

export function FitbitIntegrationCard() {
  const { isConnected, disconnect, fitbitUserProfile } = useFitbit()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg viewBox="0 0 45 45" className="h-6 w-6 text-[#00B0B9]" fill="currentColor">
            <path d="M22.5 0C10.1 0 0 10.1 0 22.5S10.1 45 22.5 45 45 34.9 45 22.5 34.9 0 22.5 0zm0 41.7c-10.6 0-19.2-8.6-19.2-19.2S11.9 3.3 22.5 3.3s19.2 8.6 19.2 19.2-8.6 19.2-19.2 19.2z" />
            <path d="M22.5 7.5c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 26.7c-6.5 0-11.7-5.2-11.7-11.7s5.2-11.7 11.7-11.7 11.7 5.2 11.7 11.7-5.2 11.7-11.7 11.7z" />
            <path d="M22.5 15c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5zm0 11.7c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2z" />
            <circle cx="22.5" cy="22.5" r="2.5" />
          </svg>
          Fitbit
        </CardTitle>
        <CardDescription>
          Connect your Fitbit account to sync your activity, sleep, and heart rate data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#00B0B9]/10 flex items-center justify-center">
                <svg viewBox="0 0 45 45" className="h-6 w-6 text-[#00B0B9]" fill="currentColor">
                  <path d="M22.5 0C10.1 0 0 10.1 0 22.5S10.1 45 22.5 45 45 34.9 45 22.5 34.9 0 22.5 0zm0 41.7c-10.6 0-19.2-8.6-19.2-19.2S11.9 3.3 22.5 3.3s19.2 8.6 19.2 19.2-8.6 19.2-19.2 19.2z" />
                  <path d="M22.5 7.5c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm0 26.7c-6.5 0-11.7-5.2-11.7-11.7s5.2-11.7 11.7-11.7 11.7 5.2 11.7 11.7-5.2 11.7-11.7 11.7z" />
                  <path d="M22.5 15c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5zm0 11.7c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2z" />
                  <circle cx="22.5" cy="22.5" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{fitbitUserProfile?.user?.displayName || "Fitbit User"}</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              Your Fitbit data is being synced successfully.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              Connect your Fitbit account to enable health data tracking and personalized insights.
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" onClick={disconnect} className="w-full">
            Disconnect
          </Button>
        ) : (
          <FitbitConnectButton />
        )}
      </CardFooter>
    </Card>
  )
}

export default FitbitIntegrationCard
