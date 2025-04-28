"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFitbit } from "@/lib/fitbit/fitbit-context"
import { useFitbitData } from "@/lib/fitbit/use-fitbit-data"
import { Activity, RefreshCw, Heart, Bed, Footprints } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default function FitbitDashboard() {
  const { isConnected } = useFitbit()
  const { healthData, lastSynced, syncRecentData, isSyncing } = useFitbitData()

  if (!isConnected) {
    return (
      <Card className="border-flowwise-lightPink/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
            Fitbit Integration
          </CardTitle>
          <CardDescription>Connect your Fitbit account for personalized health insights</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Connect your Fitbit account to see how your activity, sleep, and heart rate correlate with your menstrual
            cycle.
          </p>
          <Link href="/integrations">
            <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
              Connect Fitbit
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (healthData.length === 0) {
    return (
      <Card className="border-flowwise-lightPink/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
            Fitbit Data
          </CardTitle>
          <CardDescription>Your Fitbit account is connected, but no data has been synced yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">Sync your Fitbit data to see your health metrics</p>
          <Button
            onClick={syncRecentData}
            disabled={isSyncing}
            className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Sync Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-flowwise-lightPink/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              Fitbit Health Data
            </CardTitle>
            <CardDescription>
              Last synced: {lastSynced ? formatDistanceToNow(lastSynced, { addSuffix: true }) : "Never"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={syncRecentData}
            disabled={isSyncing}
            className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Sync
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-flowwise-mint/10 dark:bg-flowwise-burgundy/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Footprints className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              <h3 className="font-medium">Activity</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Steps</span>
                <span className="font-medium">{healthData[0].activity.steps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Minutes</span>
                <span className="font-medium">{healthData[0].activity.activeMinutes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{healthData[0].activity.caloriesBurned.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-flowwise-mint/10 dark:bg-flowwise-burgundy/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              <h3 className="font-medium">Sleep</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {Math.floor(healthData[0].sleep.minutesAsleep / 60)}h {healthData[0].sleep.minutesAsleep % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time in Bed</span>
                <span className="font-medium">
                  {Math.floor(healthData[0].sleep.timeInBed / 60)}h {healthData[0].sleep.timeInBed % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-medium">{healthData[0].sleep.efficiency}%</span>
              </div>
            </div>
          </div>

          <div className="bg-flowwise-mint/10 dark:bg-flowwise-burgundy/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              <h3 className="font-medium">Heart Rate</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resting HR</span>
                <span className="font-medium">{healthData[0].heart.restingHeartRate} bpm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fat Burn Zone</span>
                <span className="font-medium">{healthData[0].heart.zones.fatBurn} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cardio Zone</span>
                <span className="font-medium">{healthData[0].heart.zones.cardio} min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Cycle Correlation Insights</h3>
          <p className="text-sm text-muted-foreground">
            Based on your Fitbit data and menstrual cycle tracking, we've noticed that your sleep quality tends to
            decrease during the luteal phase. Consider adjusting your bedtime routine during this phase for better rest.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/health">
          <Button variant="link" className="p-0 text-flowwise-red hover:text-flowwise-burgundy">
            View detailed health insights
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
