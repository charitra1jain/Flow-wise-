"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CalendarIcon,
  TrendingUp,
  PlusCircle,
  Save,
  Droplets,
  Zap,
  Heart,
  Brain,
  Activity,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Info,
  BarChart3,
  CalendarIcon as CalendarIconAlt,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { format, isToday, isYesterday, subDays } from "date-fns"
import {
  saveTrackerLogs,
  loadTrackerLogs,
  getCycleStatistics,
  getSymptomPatterns,
  deleteTrackerLog,
  exportTrackerData,
} from "@/lib/tracker-service"
import TrackerChatIntegration from "@/components/tracker-chat-integration"
import { PeriodTrackingGraphs } from "@/components/period-tracking-graphs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type SymptomLog = {
  date: Date
  flow: number
  pain: number
  mood: number
  symptoms: string[]
  notes: string
}

const SYMPTOMS_LIST = [
  { id: "bloating", label: "Bloating", icon: "🫃", category: "physical" },
  { id: "headache", label: "Headache", icon: "🤕", category: "physical" },
  { id: "fatigue", label: "Fatigue", icon: "😴", category: "physical" },
  { id: "breast-tenderness", label: "Breast tenderness", icon: "💔", category: "physical" },
  { id: "acne", label: "Acne", icon: "😣", category: "physical" },
  { id: "nausea", label: "Nausea", icon: "🤢", category: "physical" },
  { id: "dizziness", label: "Dizziness", icon: "😵", category: "physical" },
  { id: "cravings", label: "Cravings", icon: "🍫", category: "physical" },
  { id: "insomnia", label: "Insomnia", icon: "😵‍💫", category: "physical" },
  { id: "mood-swings", label: "Mood swings", icon: "🎭", category: "emotional" },
  { id: "cramps", label: "Cramps", icon: "⚡", category: "physical" },
  { id: "backache", label: "Backache", icon: "🦴", category: "physical" },
  { id: "anxiety", label: "Anxiety", icon: "😰", category: "emotional" },
  { id: "irritability", label: "Irritability", icon: "😤", category: "emotional" },
  { id: "depression", label: "Low mood", icon: "😔", category: "emotional" },
]

export default function TrackerPage() {
  // State management
  const [date, setDate] = useState<Date>(new Date())
  const [flow, setFlow] = useState<number>(0)
  const [pain, setPain] = useState<number>(0)
  const [mood, setMood] = useState<number>(5)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState<string>("")
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [activeTab, setActiveTab] = useState<string>("today")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasExistingLog, setHasExistingLog] = useState<boolean>(false)
  const [cycleStats, setCycleStats] = useState<any>(null)
  const [symptomPatterns, setSymptomPatterns] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [logToDelete, setLogToDelete] = useState<Date | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  // Load data on component mount
  useEffect(() => {
    if (user) {
      setIsLoading(true)
      try {
        const storedLogs = loadTrackerLogs(user.id)
        if (storedLogs && storedLogs.length > 0) {
          const fixedLogs = storedLogs.map((log) => ({
            ...log,
            date: log.date instanceof Date ? log.date : new Date(log.date),
          }))
          setLogs(fixedLogs)

          // Get statistics and patterns
          const stats = getCycleStatistics(user.id)
          const patterns = getSymptomPatterns(user.id)
          setCycleStats(stats)
          setSymptomPatterns(patterns)
        }
      } catch (error) {
        console.error("Error loading tracker data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading your tracker data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [user, toast])

  // Check for existing log when date changes
  useEffect(() => {
    if (date && logs.length > 0) {
      try {
        const existingLog = logs.find((log) => {
          const logDate = log.date instanceof Date ? log.date : new Date(log.date)
          return logDate.toDateString() === date.toDateString()
        })

        if (existingLog) {
          setHasExistingLog(true)
          setFlow(existingLog.flow)
          setPain(existingLog.pain)
          setMood(existingLog.mood)
          setSelectedSymptoms(existingLog.symptoms || [])
          setNotes(existingLog.notes || "")
        } else {
          setHasExistingLog(false)
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

  // Helper functions
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

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }

  // Event handlers
  const handleSymptomChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

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
        date: new Date(date),
        flow,
        pain,
        mood,
        symptoms: selectedSymptoms,
        notes,
      }

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

      updatedLogs.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })

      setLogs(updatedLogs)
      saveTrackerLogs(user.id, updatedLogs)

      // Update statistics
      const stats = getCycleStatistics(user.id)
      const patterns = getSymptomPatterns(user.id)
      setCycleStats(stats)
      setSymptomPatterns(patterns)

      toast({
        title: hasExistingLog ? "Log updated" : "Log saved",
        description: `Your symptoms for ${getDateLabel(date)} have been ${hasExistingLog ? "updated" : "saved"}.`,
      })

      // Auto-navigate to insights if this is their first few logs
      if (updatedLogs.length <= 3) {
        setTimeout(() => setActiveTab("insights"), 1000)
      }
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

  const handleDeleteLog = async (dateToDelete: Date) => {
    if (!user) return

    try {
      const success = deleteTrackerLog(user.id, dateToDelete)
      if (success) {
        const updatedLogs = logs.filter((log) => {
          const logDate = log.date instanceof Date ? log.date : new Date(log.date)
          return logDate.toDateString() !== dateToDelete.toDateString()
        })
        setLogs(updatedLogs)

        // Update statistics
        const stats = getCycleStatistics(user.id)
        const patterns = getSymptomPatterns(user.id)
        setCycleStats(stats)
        setSymptomPatterns(patterns)

        toast({
          title: "Log deleted",
          description: `Log for ${getDateLabel(dateToDelete)} has been deleted.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete log. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
    setLogToDelete(null)
  }

  const handleExportData = () => {
    if (!user || logs.length === 0) return

    try {
      const csvData = exportTrackerData(user.id, "csv")
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `flowwise_tracker_data_${format(new Date(), "yyyy-MM-dd")}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Data exported",
        description: "Your tracking data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getDaysUntilNextPeriod = () => {
    if (!cycleStats || !cycleStats.nextPeriodDate) return null
    const today = new Date()
    const nextPeriod = new Date(cycleStats.nextPeriodDate)
    const diffTime = nextPeriod.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:py-16">
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-flowwise-pink border-t-transparent"></div>
          <p className="text-muted-foreground">Loading your tracker data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-flowwise-mint/10 via-background to-flowwise-lightPink/10">
      <div className="container px-4 py-12 md:py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4 text-center mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-flowwise-burgundy to-flowwise-red flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Period Tracker</h1>
          </div>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
            Track your menstrual cycle, symptoms, and mood to understand your body better
          </p>

          {/* Quick Stats */}
          {logs.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-flowwise-lightPink/20">
                <div className="text-sm text-muted-foreground">Days Tracked</div>
                <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">{logs.length}</div>
              </div>
              {cycleStats?.hasEnoughData && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-flowwise-lightPink/20">
                  <div className="text-sm text-muted-foreground">Avg Cycle</div>
                  <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                    {cycleStats.avgCycleLength} days
                  </div>
                </div>
              )}
              {getDaysUntilNextPeriod() !== null && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-flowwise-lightPink/20">
                  <div className="text-sm text-muted-foreground">Next Period</div>
                  <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                    {getDaysUntilNextPeriod()} days
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="today" className="text-base">
                <CalendarIcon className="mr-2 h-4 w-4" /> Today
              </TabsTrigger>
              <TabsTrigger value="history" className="text-base">
                <CalendarIconAlt className="mr-2 h-4 w-4" /> History
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-base">
                <BarChart3 className="mr-2 h-4 w-4" /> Insights
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-base">
                <TrendingUp className="mr-2 h-4 w-4" /> Analytics
              </TabsTrigger>
            </TabsList>

            {/* Today Tab */}
            <TabsContent value="today" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Section */}
                <Card className="lg:col-span-1 border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                      Select Date
                    </CardTitle>
                    {hasExistingLog && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 w-fit"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Log exists
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border border-flowwise-lightPink/20"
                      modifiers={{
                        logged: logs.map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                        period: logs
                          .filter((log) => log.flow > 0)
                          .map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                        highPain: logs
                          .filter((log) => log.pain >= 7)
                          .map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                      }}
                      modifiersStyles={{
                        logged: {
                          fontWeight: "bold",
                          backgroundColor: "rgba(236, 72, 153, 0.1)",
                          borderRadius: "100%",
                        },
                        period: {
                          backgroundColor: "rgba(236, 72, 153, 0.3)",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "100%",
                        },
                        highPain: {
                          backgroundColor: "rgba(239, 68, 68, 0.3)",
                          borderRadius: "100%",
                        },
                      }}
                    />

                    {/* Calendar Legend */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-flowwise-pink/30"></div>
                        <span>Period days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-flowwise-pink/10 border border-flowwise-pink/50"></div>
                        <span>Logged days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-300"></div>
                        <span>High pain days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Logging Form */}
                <Card className="lg:col-span-2 border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Log for {getDateLabel(date)}</span>
                      {hasExistingLog && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLogToDelete(date)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {hasExistingLog
                        ? "Editing existing log - make changes and save to update"
                        : "Track your symptoms, flow, pain, and mood for today"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Flow Tracking */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center text-base font-medium">
                          <Droplets className="h-5 w-5 mr-2 text-flowwise-burgundy dark:text-flowwise-pink" />
                          Menstrual Flow
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px]">Rate your menstrual flow from 0 (none) to 10 (very heavy)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Badge
                          variant="outline"
                          className="bg-flowwise-pink/10 text-flowwise-burgundy border-flowwise-pink/30"
                        >
                          {getFlowLabel(flow)} ({flow}/10)
                        </Badge>
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
                      <Progress value={flow * 10} className="h-2" />
                    </div>

                    {/* Pain Tracking */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center text-base font-medium">
                          <Zap className="h-5 w-5 mr-2 text-flowwise-burgundy dark:text-flowwise-pink" />
                          Pain Level
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px]">Rate your pain level from 0 (no pain) to 10 (severe pain)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Badge
                          variant="outline"
                          className="bg-flowwise-pink/10 text-flowwise-burgundy border-flowwise-pink/30"
                        >
                          {getPainLabel(pain)} ({pain}/10)
                        </Badge>
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
                      <Progress value={pain * 10} className="h-2" />
                    </div>

                    {/* Mood Tracking */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center text-base font-medium">
                          <Heart className="h-5 w-5 mr-2 text-flowwise-burgundy dark:text-flowwise-pink" />
                          Mood
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px]">Rate your mood from 1 (very low) to 10 (excellent)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Badge
                          variant="outline"
                          className="bg-flowwise-pink/10 text-flowwise-burgundy border-flowwise-pink/30"
                        >
                          {getMoodLabel(mood)} {getMoodEmoji(mood)} ({mood}/10)
                        </Badge>
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
                      <Progress value={mood * 10} className="h-2" />
                    </div>

                    <Separator />

                    {/* Symptoms Selection */}
                    <div className="space-y-4">
                      <Label className="flex items-center text-base font-medium">
                        <Brain className="h-5 w-5 mr-2 text-flowwise-burgundy dark:text-flowwise-pink" />
                        Symptoms
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">Select any symptoms you're experiencing today</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>

                      {/* Physical Symptoms */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Physical Symptoms</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {SYMPTOMS_LIST.filter((s) => s.category === "physical").map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.label)}
                                onCheckedChange={() => handleSymptomChange(symptom.label)}
                                className="border-flowwise-pink/50 data-[state=checked]:bg-flowwise-burgundy data-[state=checked]:border-flowwise-burgundy"
                              />
                              <label
                                htmlFor={symptom.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                              >
                                <span>{symptom.icon}</span>
                                {symptom.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Emotional Symptoms */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Emotional Symptoms</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {SYMPTOMS_LIST.filter((s) => s.category === "emotional").map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.label)}
                                onCheckedChange={() => handleSymptomChange(symptom.label)}
                                className="border-flowwise-pink/50 data-[state=checked]:bg-flowwise-burgundy data-[state=checked]:border-flowwise-burgundy"
                              />
                              <label
                                htmlFor={symptom.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                              >
                                <span>{symptom.icon}</span>
                                {symptom.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selected Symptoms Summary */}
                      {selectedSymptoms.length > 0 && (
                        <div className="mt-4 p-3 bg-flowwise-mint/10 rounded-lg border border-flowwise-mint/30">
                          <p className="text-sm font-medium mb-2">Selected symptoms ({selectedSymptoms.length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedSymptoms.map((symptom, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-flowwise-pink/10 text-flowwise-burgundy border-flowwise-pink/30"
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                      <Label htmlFor="notes" className="text-base font-medium">
                        Additional Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px] border-flowwise-lightPink/30 focus-visible:ring-flowwise-burgundy"
                        placeholder="Add any additional notes about how you're feeling today, activities, medications, etc..."
                      />
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button
                      onClick={handleSaveLog}
                      className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity text-white font-medium py-3"
                      disabled={isSaving}
                      size="lg"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {isSaving ? "Saving..." : hasExistingLog ? "Update Log" : "Save Log"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              {logs.length > 0 && (
                <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setDate(subDays(new Date(), 1))}
                        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                      >
                        Log Yesterday
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("insights")}
                        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Insights
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                        className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                      <TrackerChatIntegration />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              {logs.length === 0 ? (
                <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>No Logs Yet</CardTitle>
                    <CardDescription>Start tracking your symptoms to build your history</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Your tracking history will appear here once you start logging your symptoms.
                    </p>
                    <Button
                      onClick={() => setActiveTab("today")}
                      className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Start Tracking
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                      Your Tracking History
                    </h2>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export All Data
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {logs.map((log, index) => {
                      const logDate = log.date instanceof Date ? log.date : new Date(log.date)
                      return (
                        <Card
                          key={index}
                          className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm card-hover"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{getDateLabel(logDate)}</h3>
                                <p className="text-sm text-muted-foreground">{format(logDate, "EEEE, MMMM d, yyyy")}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDate(logDate)
                                    setActiveTab("today")
                                  }}
                                  className="text-flowwise-burgundy hover:text-flowwise-red hover:bg-flowwise-pink/10"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setLogToDelete(logDate)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
                                <span className="text-sm">Flow: {getFlowLabel(log.flow)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {log.flow}/10
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
                                <span className="text-sm">Pain: {getPainLabel(log.pain)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {log.pain}/10
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
                                <span className="text-sm">
                                  Mood: {getMoodLabel(log.mood)} {getMoodEmoji(log.mood)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {log.mood}/10
                                </Badge>
                              </div>
                            </div>

                            {log.symptoms && log.symptoms.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium mb-2">Symptoms:</p>
                                <div className="flex flex-wrap gap-1">
                                  {log.symptoms.map((symptom, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="bg-flowwise-pink/10 text-flowwise-burgundy border-flowwise-pink/30"
                                    >
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {log.notes && (
                              <div>
                                <p className="text-sm font-medium mb-1">Notes:</p>
                                <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                                  {log.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              {logs.length === 0 ? (
                <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>No Insights Available</CardTitle>
                    <CardDescription>Start logging your symptoms to see personalized insights</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Track your symptoms regularly to get personalized insights about your menstrual cycle.
                    </p>
                    <Button
                      onClick={() => setActiveTab("today")}
                      className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Start Tracking
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Cycle Prediction */}
                  <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                        Cycle Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert className="border-flowwise-lightPink/50 bg-flowwise-mint/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-flowwise-burgundy dark:text-flowwise-pink">
                          Cycle Prediction
                        </AlertTitle>
                        <AlertDescription>
                          {cycleStats && cycleStats.hasEnoughData ? (
                            <>
                              Based on your {cycleStats.totalLogsCount} logged days, your next period is likely to start
                              in approximately <strong>{getDaysUntilNextPeriod()} days</strong> (around{" "}
                              <strong>{format(new Date(cycleStats.nextPeriodDate), "MMMM d, yyyy")}</strong>).
                            </>
                          ) : (
                            <>
                              We need more data to predict your next period accurately. Keep logging your symptoms! You
                              have {logs.length} logged days - try to log for at least 2 complete cycles for better
                              predictions.
                            </>
                          )}
                        </AlertDescription>
                      </Alert>

                      {cycleStats?.hasEnoughData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                            <p className="text-sm text-muted-foreground">Average Cycle Length</p>
                            <p className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                              {cycleStats.avgCycleLength} days
                            </p>
                          </div>
                          <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                            <p className="text-sm text-muted-foreground">Average Period Length</p>
                            <p className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                              {cycleStats.avgPeriodLength} days
                            </p>
                          </div>
                          <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                            <p className="text-sm text-muted-foreground">Cycles Tracked</p>
                            <p className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                              {cycleStats.cycleCount}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Symptom Patterns */}
                  {symptomPatterns?.hasEnoughData && (
                    <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                          Symptom Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Based on your {logs.length} logged days, here are your most common symptoms:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {symptomPatterns.detailedSymptoms.slice(0, 6).map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-flowwise-mint/10 rounded-lg border border-flowwise-mint/30"
                              >
                                <span className="font-medium">{item.symptom}</span>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                                    {item.frequency}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">{item.count} times</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Activity */}
                  <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                          Recent Activity
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("today")}
                          className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add New Log
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {logs.slice(0, 5).map((log, index) => {
                          const logDate = log.date instanceof Date ? log.date : new Date(log.date)
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                              onClick={() => {
                                setDate(logDate)
                                setActiveTab("today")
                              }}
                            >
                              <div>
                                <p className="font-medium">{getDateLabel(logDate)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {log.symptoms?.length || 0} symptoms • Flow: {getFlowLabel(log.flow)} • Pain:{" "}
                                  {getPainLabel(log.pain)}
                                </p>
                              </div>
                              <Edit3 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <PeriodTrackingGraphs />
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Log</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the log for {logToDelete ? getDateLabel(logToDelete) : ""}? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setLogToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => logToDelete && handleDeleteLog(logToDelete)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
