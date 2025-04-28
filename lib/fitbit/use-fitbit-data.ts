"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useFitbit } from "./fitbit-context"
import { getDailyHealthData } from "./fitbit-service"
import {
  saveFitbitHealthData,
  loadFitbitHealthData,
  processFitbitData,
  type FitbitHealthData,
} from "./fitbit-data-storage"
import { useToast } from "@/hooks/use-toast"

export function useFitbitData() {
  const [healthData, setHealthData] = useState<FitbitHealthData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const { user } = useAuth()
  const { fitbitTokens, isConnected, updateTokens } = useFitbit()
  const { toast } = useToast()

  // Load cached health data
  useEffect(() => {
    if (typeof window === "undefined") return

    if (user && isConnected) {
      const cachedData = loadFitbitHealthData(user.id)
      setHealthData(cachedData)

      // Set last synced time from localStorage
      const lastSyncedTime = localStorage.getItem(`fitbit_last_synced_${user.id}`)
      if (lastSyncedTime) {
        setLastSynced(new Date(lastSyncedTime))
      }

      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [user, isConnected])

  // Function to sync data for a specific date
  const syncDateData = async (date: string) => {
    if (!user || !fitbitTokens) return null

    try {
      const rawData = await getDailyHealthData(date, fitbitTokens, updateTokens)
      const processedData = processFitbitData(rawData)

      // Save to localStorage
      saveFitbitHealthData(user.id, processedData)

      return processedData
    } catch (error) {
      console.error(`Error syncing data for date ${date}:`, error)
      return null
    }
  }

  // Function to sync data for the last 7 days
  const syncRecentData = async () => {
    if (!user || !fitbitTokens || isSyncing) return

    setIsSyncing(true)

    try {
      // Get dates for the last 7 days
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(date.toISOString().split("T")[0]) // Format: YYYY-MM-DD
      }

      // Sync data for each date
      const results = await Promise.allSettled(dates.map((date) => syncDateData(date)))

      // Filter successful results
      const successfulResults = results
        .filter(
          (result): result is PromiseFulfilledResult<FitbitHealthData | null> =>
            result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => result.value) as FitbitHealthData[]

      // Update state
      setHealthData(successfulResults)

      // Update last synced time
      const now = new Date()
      setLastSynced(now)
      localStorage.setItem(`fitbit_last_synced_${user.id}`, now.toISOString())

      toast({
        title: "Fitbit data synced",
        description: `Successfully synced data for ${successfulResults.length} days.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error syncing recent data:", error)
      toast({
        title: "Sync failed",
        description: "There was an error syncing your Fitbit data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return {
    healthData,
    isLoading,
    isSyncing,
    lastSynced,
    syncRecentData,
    syncDateData,
  }
}
