"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LineChart, CalendarIcon, LineChartIcon, PlusCircle, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SymptomLog = {
  date: Date
  flow: number
  pain: number
  mood: number
  symptoms: string[]
  notes: string
}

export default function TrackerPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [flow, setFlow] = useState<number>(0)
  const [pain, setPain] = useState<number>(0)
  const [mood, setMood] = useState<number>(5)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState<string>("")
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [activeTab, setActiveTab] = useState<string>("log")

  const symptoms = [
    "Bloating",
    "Headache",
    "Fatigue",
    "Breast tenderness",
    "Acne",
    "Nausea",
    "Dizziness",
    "Cravings",
    "Insomnia",
  ]

  const handleSymptomChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleSaveLog = () => {
    const newLog: SymptomLog = {
      date,
      flow,
      pain,
      mood,
      symptoms: selectedSymptoms,
      notes,
    }

    // Check if there's already a log for this date and replace it
    const existingLogIndex = logs.findIndex((log) => log.date.toDateString() === date.toDateString())

    if (existingLogIndex !== -1) {
      const updatedLogs = [...logs]
      updatedLogs[existingLogIndex] = newLog
      setLogs(updatedLogs)
    } else {
      setLogs([...logs, newLog])
    }

    // Reset form
    setFlow(0)
    setPain(0)
    setMood(5)
    setSelectedSymptoms([])
    setNotes("")

    // Switch to insights tab
    setActiveTab("insights")
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          Symptom Tracker
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Track your menstrual symptoms and get personalized insights
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="log" className="text-base">
              <PlusCircle className="mr-2 h-4 w-4" /> Log Symptoms
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-base">
              <LineChartIcon className="mr-2 h-4 w-4" /> Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 border-pink-100 dark:border-pink-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-pink-100 dark:border-pink-900/50">
                <CardHeader>
                  <CardTitle>Log Your Symptoms</CardTitle>
                  <CardDescription>Track how you're feeling today to get personalized insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Flow Intensity (0-10)</Label>
                    <Slider
                      value={[flow]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => setFlow(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>None</span>
                      <span>Light</span>
                      <span>Moderate</span>
                      <span>Heavy</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Pain Level (0-10)</Label>
                    <Slider
                      value={[pain]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => setPain(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>None</span>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mood (1-10)</Label>
                    <Slider
                      value={[mood]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setMood(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Low</span>
                      <span>Low</span>
                      <span>Neutral</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Other Symptoms</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {symptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom}
                            checked={selectedSymptoms.includes(symptom)}
                            onCheckedChange={() => handleSymptomChange(symptom)}
                          />
                          <label
                            htmlFor={symptom}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {symptom}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any additional notes here..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveLog} className="w-full bg-pink-600 hover:bg-pink-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Log
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              {logs.length === 0 ? (
                <Card className="border-pink-100 dark:border-pink-900/50">
                  <CardHeader>
                    <CardTitle>No Data Yet</CardTitle>
                    <CardDescription>Start logging your symptoms to see personalized insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setActiveTab("log")} className="bg-pink-600 hover:bg-pink-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Log Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="border-pink-100 dark:border-pink-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        Your Insights
                      </CardTitle>
                      <CardDescription>Personalized insights based on your logged data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="border-pink-200 dark:border-pink-900 bg-pink-50 dark:bg-pink-950/20">
                        <AlertTitle className="text-pink-600 dark:text-pink-400">Cycle Prediction</AlertTitle>
                        <AlertDescription>
                          Based on your logs, your next period is likely to start in approximately 14 days.
                        </AlertDescription>
                      </Alert>

                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Trends</h3>
                        <p className="text-sm text-muted-foreground">
                          In a fully implemented version, this section would show charts and graphs of your symptoms
                          over time, helping you identify patterns in your menstrual cycle.
                        </p>
                        <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Chart visualization would appear here</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Recent Logs</h3>
                        <div className="space-y-4">
                          {logs
                            .slice()
                            .reverse()
                            .slice(0, 3)
                            .map((log, index) => (
                              <div key={index} className="border rounded-md p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{log.date.toDateString()}</h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      log.flow > 0
                                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                  >
                                    {log.flow > 0 ? `Flow: ${log.flow}/10` : "No Flow"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>Pain: {log.pain}/10</div>
                                  <div>Mood: {log.mood}/10</div>
                                </div>
                                {log.symptoms.length > 0 && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Symptoms: </span>
                                    {log.symptoms.join(", ")}
                                  </div>
                                )}
                                {log.notes && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Notes: </span>
                                    {log.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
