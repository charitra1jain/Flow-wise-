"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarIcon,
  LineChartIcon,
  PlusCircle,
  Save,
  Droplets,
  ThermometerIcon,
  SmileIcon,
  InfoIcon,
  CheckCircle2,
  LineChart,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { saveTrackerLogs, loadTrackerLogs, getCycleStatistics } from "@/lib/tracker-service"
import TrackerChatIntegration from "@/components/tracker-chat-integration"

export type SymptomLog = {
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
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [hasExistingLog, setHasExistingLog] = useState<boolean>(false)
  const [cycleStats, setCycleStats] = useState<any>(null)

  const symptoms = [
    { id: "bloating", label: "Bloating" },
    { id: "headache", label: "Headache" },
    { id: "fatigue", label: "Fatigue" },
    { id: "breast-tenderness", label: "Breast tenderness" },
    { id: "acne", label: "Acne" },
    { id: "nausea", label: "Nausea" },
    { id: "dizziness", label: "Dizziness" },
    { id: "cravings", label: "Cravings" },
    { id: "insomnia", label: "Insomnia" },
    { id: "mood-swings", label: "Mood swings" },
    { id: "cramps", label: "Cramps" },
    { id: "backache", label: "Backache" },
  ]

  // Load logs from storage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const storedLogs = loadTrackerLogs(user.id)
        console.log("Loaded tracker logs:", storedLogs)
        if (storedLogs && storedLogs.length > 0) {
          // Ensure all dates are proper Date objects
          const fixedLogs = storedLogs.map((log) => ({
            ...log,
            date: log.date instanceof Date ? log.date : new Date(log.date),
          }))
          setLogs(fixedLogs)

          // Get cycle statistics
          const stats = getCycleStatistics(user.id)
          setCycleStats(stats)
        }
      } catch (error) {
        console.error("Error loading tracker logs:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading your tracker data. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [user, toast])

  // Check if there's an existing log for the selected date
  useEffect(() => {
    if (date && logs.length > 0) {
      try {
        const existingLog = logs.find((log) => {
          const logDate = log.date instanceof Date ? log.date : new Date(log.date)
          return logDate.toDateString() === date.toDateString()
        })

        if (existingLog) {
          setHasExistingLog(true)
          // Pre-fill the form with existing data
          setFlow(existingLog.flow)
          setPain(existingLog.pain)
          setMood(existingLog.mood)
          setSelectedSymptoms(existingLog.symptoms || [])
          setNotes(existingLog.notes || "")
        } else {
          setHasExistingLog(false)
          // Reset form to defaults
          setFlow(0)
          setPain(0)
          setMood(5)
          setSelectedSymptoms([])
          setNotes("")
        }
      } catch (error) {
        console.error("Error checking for existing log:", error)
      }
    }
  }, [date, logs])

  const handleSymptomChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  // Update the handleSaveLog function to ensure proper date handling
  const handleSaveLog = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your logs.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const newLog: SymptomLog = {
        date: new Date(date), // Ensure we have a fresh Date object
        flow,
        pain,
        mood,
        symptoms: selectedSymptoms,
        notes,
      }

      // Check if there's already a log for this date and replace it
      const existingLogIndex = logs.findIndex((log) => {
        const logDate = log.date instanceof Date ? log.date : new Date(log.date)
        return logDate.toDateString() === date.toDateString()
      })

      let updatedLogs: SymptomLog[]

      if (existingLogIndex !== -1) {
        updatedLogs = [...logs]
        updatedLogs[existingLogIndex] = newLog
      } else {
        updatedLogs = [...logs, newLog]
      }

      // Sort logs by date (newest first)
      updatedLogs.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })

      setLogs(updatedLogs)

      // Save to localStorage
      console.log("Saving logs:", updatedLogs)
      saveTrackerLogs(user.id, updatedLogs)

      // Update cycle statistics
      const stats = getCycleStatistics(user.id)
      setCycleStats(stats)

      toast({
        title: hasExistingLog ? "Log updated" : "Log saved",
        description: `Your symptoms for ${format(date, "MMMM d, yyyy")} have been ${hasExistingLog ? "updated" : "saved"}.`,
      })

      // Switch to insights tab
      setActiveTab("insights")
    } catch (error) {
      console.error("Error saving log:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getFlowLabel = (value: number) => {
    if (value === 0) return "None"
    if (value <= 3) return "Light"
    if (value <= 7) return "Moderate"
    return "Heavy"
  }

  const getPainLabel = (value: number) => {
    if (value === 0) return "None"
    if (value <= 3) return "Mild"
    if (value <= 7) return "Moderate"
    return "Severe"
  }

  const getMoodLabel = (value: number) => {
    if (value <= 2) return "Very Low"
    if (value <= 4) return "Low"
    if (value <= 6) return "Neutral"
    if (value <= 8) return "Good"
    return "Excellent"
  }

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return "😢"
    if (value <= 4) return "😕"
    if (value <= 6) return "😐"
    if (value <= 8) return "🙂"
    return "😄"
  }

  // Calculate days until next period
  const getDaysUntilNextPeriod = () => {
    if (!cycleStats || !cycleStats.nextPeriodDate) return null

    const today = new Date()
    const nextPeriod = new Date(cycleStats.nextPeriodDate)
    const diffTime = nextPeriod.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
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
                  {hasExistingLog && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Log exists
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      logged: logs.map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                    }}
                    modifiersStyles={{
                      logged: {
                        fontWeight: "bold",
                        backgroundColor: "rgba(236, 72, 153, 0.1)",
                        borderRadius: "100%",
                      },
                    }}
                  />
                </CardContent>
                {logs.length > 0 && (
                  <CardFooter>
                    <TrackerChatIntegration />
                  </CardFooter>
                )}
              </Card>

              <Card className="md:col-span-2 border-pink-100 dark:border-pink-900/50">
                <CardHeader>
                  <CardTitle>Log Your Symptoms</CardTitle>
                  <CardDescription>
                    {hasExistingLog
                      ? `Editing log for ${format(date, "MMMM d, yyyy")}`
                      : `Track how you're feeling on ${format(date, "MMMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center">
                        <Droplets className="h-4 w-4 mr-2 text-pink-600 dark:text-pink-400" />
                        Flow Intensity
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">Rate your menstrual flow from 0 (none) to 10 (very heavy)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                        {getFlowLabel(flow)} ({flow}/10)
                      </span>
                    </div>
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
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center">
                        <ThermometerIcon className="h-4 w-4 mr-2 text-pink-600 dark:text-pink-400" />
                        Pain Level
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">Rate your pain level from 0 (no pain) to 10 (severe pain)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                        {getPainLabel(pain)} ({pain}/10)
                      </span>
                    </div>
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
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center">
                        <SmileIcon className="h-4 w-4 mr-2 text-pink-600 dark:text-pink-400" />
                        Mood
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">Rate your mood from 1 (very low) to 10 (excellent)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                        {getMoodLabel(mood)} {getMoodEmoji(mood)} ({mood}/10)
                      </span>
                    </div>
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
                    <Label className="flex items-center">
                      Other Symptoms
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Select any other symptoms you're experiencing today</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {symptoms.map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={selectedSymptoms.includes(symptom.label)}
                            onCheckedChange={() => handleSymptomChange(symptom.label)}
                            className="border-pink-300 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                          />
                          <label
                            htmlFor={symptom.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {symptom.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center">
                      Notes
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">Add any additional notes about how you're feeling today</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px] border-pink-100 focus-visible:ring-pink-500 dark:border-pink-900/50"
                      placeholder="Add any additional notes here..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveLog} className="w-full bg-pink-600 hover:bg-pink-700" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : hasExistingLog ? "Update Log" : "Save Log"}
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
                  <CardContent className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Track your symptoms regularly to get personalized insights about your menstrual cycle.
                    </p>
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
                          {cycleStats && cycleStats.nextPeriodDate ? (
                            <>
                              Based on your logs, your next period is likely to start in approximately{" "}
                              {getDaysUntilNextPeriod()} days (around{" "}
                              {format(new Date(cycleStats.nextPeriodDate), "MMMM d, yyyy")}).
                            </>
                          ) : (
                            <>We need more data to predict your next period accurately. Keep logging your symptoms!</>
                          )}
                        </AlertDescription>
                      </Alert>

                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-medium">Trends</h3>
                        <p className="text-sm text-muted-foreground">
                          {cycleStats && cycleStats.hasEnoughData ? (
                            <>
                              Based on your logs, your average cycle length is approximately {cycleStats.avgCycleLength}{" "}
                              days, with periods lasting around {cycleStats.avgPeriodLength} days.
                            </>
                          ) : (
                            <>Keep logging your symptoms to see personalized trends and insights about your cycle.</>
                          )}
                        </p>
                        <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Chart visualization would appear here</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Recent Logs</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab("log")}
                            className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950/20"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Log
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {logs.slice(0, 3).map((log, index) => {
                            const logDate = log.date instanceof Date ? log.date : new Date(log.date)
                            return (
                              <div
                                key={index}
                                className="border border-pink-100 dark:border-pink-900/30 rounded-md p-4 hover:bg-pink-50/50 dark:hover:bg-pink-950/10 transition-colors"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{format(logDate, "MMMM d, yyyy")}</h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      log.flow > 0
                                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                    }`}
                                  >
                                    {log.flow > 0 ? `Flow: ${getFlowLabel(log.flow)}` : "No Flow"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center">
                                    <ThermometerIcon className="h-3 w-3 mr-1 text-pink-600 dark:text-pink-400" />
                                    Pain: {getPainLabel(log.pain)}
                                  </div>
                                  <div className="flex items-center">
                                    <SmileIcon className="h-3 w-3 mr-1 text-pink-600 dark:text-pink-400" />
                                    Mood: {getMoodLabel(log.mood)} {getMoodEmoji(log.mood)}
                                  </div>
                                </div>
                                {log.symptoms && log.symptoms.length > 0 && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Symptoms: </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {log.symptoms.map((symptom, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-800"
                                        >
                                          {symptom}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {log.notes && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Notes: </span>
                                    <p className="mt-1 text-muted-foreground">{log.notes}</p>
                                  </div>
                                )}
                                <div className="mt-3 pt-2 border-t border-pink-100 dark:border-pink-900/30 flex justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setDate(logDate)
                                      setActiveTab("log")
                                    }}
                                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-pink-950/20"
                                  >
                                    Edit Log
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("log")}
                        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Log
                      </Button>
                      <TrackerChatIntegration />
                    </CardFooter>
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
