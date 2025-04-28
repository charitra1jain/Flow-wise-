"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { loadTrackerLogs, saveTrackerLogs } from "@/lib/tracker-service"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function DebugTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [logsJson, setLogsJson] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loadLogs = () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to access tracker data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const logs = loadTrackerLogs(user.id)
      setLogsJson(JSON.stringify(logs, null, 2))
      toast({
        title: "Logs loaded",
        description: `Loaded ${logs.length} logs`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error loading logs:", error)
      toast({
        title: "Error loading logs",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveLogs = () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to save tracker data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const logs = JSON.parse(logsJson)

      // Convert date strings to Date objects
      const processedLogs = logs.map((log: any) => ({
        ...log,
        date: new Date(log.date),
      }))

      saveTrackerLogs(user.id, processedLogs)
      toast({
        title: "Logs saved",
        description: `Saved ${logs.length} logs`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error saving logs:", error)
      toast({
        title: "Error saving logs",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to clear tracker data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      saveTrackerLogs(user.id, [])
      setLogsJson("")
      toast({
        title: "Logs cleared",
        description: "All logs have been cleared",
        variant: "success",
      })
    } catch (error) {
      console.error("Error clearing logs:", error)
      toast({
        title: "Error clearing logs",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-pink-100 dark:border-pink-900/50">
      <CardHeader>
        <CardTitle>Debug Tracker</CardTitle>
        <CardDescription>View and modify tracker data directly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={loadLogs} disabled={isLoading} variant="outline">
              Load Logs
            </Button>
            <Button onClick={saveLogs} disabled={isLoading} variant="outline">
              Save Logs
            </Button>
            <Button onClick={clearLogs} disabled={isLoading} variant="destructive">
              Clear Logs
            </Button>
          </div>
          <Textarea
            value={logsJson}
            onChange={(e) => setLogsJson(e.target.value)}
            className="min-h-[300px] font-mono text-xs"
            placeholder="Tracker logs will appear here"
          />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Warning: Editing logs directly can cause issues if the format is incorrect
        </p>
      </CardFooter>
    </Card>
  )
}
