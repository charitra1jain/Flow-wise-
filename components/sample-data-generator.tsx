"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { saveTrackerLogs, loadTrackerLogs } from "@/lib/tracker-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SymptomLog } from "@/app/tracker/page"

export default function SampleDataGenerator() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [numDays, setNumDays] = useState(30)

  const generateSampleData = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to generate sample data",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Get existing logs
      const existingLogs = loadTrackerLogs(user.id)

      // Generate sample data
      const sampleLogs: SymptomLog[] = []
      const today = new Date()

      // Generate logs for the past numDays days
      for (let i = 0; i < numDays; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i)

        // Simulate a 28-day cycle with 5 days of period
        const dayInCycle = i % 28
        const isOnPeriod = dayInCycle < 5

        // Generate random values
        const flow = isOnPeriod ? Math.floor(Math.random() * 8) + 3 : 0 // Higher flow during period
        const pain = isOnPeriod ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 3) // Higher pain during period
        const mood = isOnPeriod ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 5) + 5 // Lower mood during period

        // Generate random symptoms
        const allSymptoms = [
          "Bloating",
          "Headache",
          "Fatigue",
          "Breast tenderness",
          "Acne",
          "Nausea",
          "Dizziness",
          "Cravings",
          "Insomnia",
          "Mood swings",
          "Cramps",
          "Backache",
        ]
        const symptoms: string[] = []

        // More symptoms during period
        const numSymptoms = isOnPeriod ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 3)

        for (let j = 0; j < numSymptoms; j++) {
          const randomIndex = Math.floor(Math.random() * allSymptoms.length)
          const symptom = allSymptoms[randomIndex]
          if (!symptoms.includes(symptom)) {
            symptoms.push(symptom)
          }
        }

        // Generate notes
        let notes = ""
        if (isOnPeriod) {
          const periodNotes = [
            "Feeling quite uncomfortable today.",
            "Taking pain relievers helped a bit.",
            "Staying hydrated seems to help with cramps.",
            "Hot water bottle providing some relief.",
            "Trying to rest more today.",
          ]
          notes = periodNotes[Math.floor(Math.random() * periodNotes.length)]
        } else if (dayInCycle >= 12 && dayInCycle <= 16) {
          // Ovulation period
          const ovulationNotes = [
            "Feeling more energetic today.",
            "Noticed some mild cramping on one side.",
            "Slight increase in discharge.",
            "Feeling quite good overall.",
            "",
          ]
          notes = ovulationNotes[Math.floor(Math.random() * ovulationNotes.length)]
        }

        sampleLogs.push({
          date,
          flow,
          pain,
          mood,
          symptoms,
          notes,
        })
      }

      // Save the combined logs
      const combinedLogs = [...sampleLogs, ...existingLogs]
      saveTrackerLogs(user.id, combinedLogs)

      toast({
        title: "Sample data generated",
        description: `Generated ${numDays} days of sample tracker data`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error generating sample data:", error)
      toast({
        title: "Error generating sample data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-pink-100 dark:border-pink-900/50">
      <CardHeader>
        <CardTitle>Sample Data Generator</CardTitle>
        <CardDescription>Generate sample tracker data for testing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numDays">Number of days to generate</Label>
            <Input
              id="numDays"
              type="number"
              min="1"
              max="90"
              value={numDays}
              onChange={(e) => setNumDays(Number.parseInt(e.target.value) || 30)}
              className="border-flowwise-lightPink/50 focus-visible:ring-flowwise-pink"
            />
          </div>
          <Button
            onClick={generateSampleData}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Sample Data"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This will generate realistic sample data for testing the tracker functionality
        </p>
      </CardFooter>
    </Card>
  )
}
