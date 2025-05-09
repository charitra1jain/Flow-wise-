"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, Download, CalendarIcon, LineChart, BarChart2, PieChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { format, subMonths, isWithinInterval, startOfMonth, endOfMonth, addMonths } from "date-fns"
import { loadTrackerLogs, getCycleStatistics } from "@/lib/tracker-service"
import type { SymptomLog } from "@/app/tracker/page"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  type TooltipProps,
} from "recharts"

// Define colors for charts
const COLORS = ["#EC4899", "#F472B6", "#F9A8D4", "#FBC7E0", "#FBCFE8"]
const SYMPTOM_COLORS = {
  Bloating: "#EC4899",
  Headache: "#F472B6",
  Fatigue: "#F9A8D4",
  "Breast tenderness": "#FBC7E0",
  Acne: "#FBCFE8",
  Nausea: "#D946EF",
  Dizziness: "#C026D3",
  Cravings: "#A855F7",
  Insomnia: "#8B5CF6",
  "Mood swings": "#7C3AED",
  Cramps: "#6D28D9",
  Backache: "#5B21B6",
}

export function PeriodTrackingGraphs() {
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [cycleStats, setCycleStats] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [selectedSymptom, setSelectedSymptom] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("calendar")
  const { toast } = useToast()
  const { user } = useAuth()

  // Load logs from storage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const storedLogs = loadTrackerLogs(user.id)
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

  // Filter logs for the selected month
  const getFilteredLogs = () => {
    if (!logs.length) return []

    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)

    return logs.filter((log) => {
      const logDate = log.date instanceof Date ? log.date : new Date(log.date)
      return isWithinInterval(logDate, { start, end })
    })
  }

  // Prepare data for flow intensity chart
  const getFlowData = () => {
    const filteredLogs = getFilteredLogs()
    return filteredLogs
      .filter((log) => log.flow > 0) // Only include days with flow
      .map((log) => ({
        date: format(log.date instanceof Date ? log.date : new Date(log.date), "MMM d"),
        flow: log.flow,
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
  }

  // Prepare data for pain and mood chart
  const getPainMoodData = () => {
    const filteredLogs = getFilteredLogs()
    return filteredLogs.map((log) => ({
      date: format(log.date instanceof Date ? log.date : new Date(log.date), "MMM d"),
      pain: log.pain,
      mood: log.mood,
    }))
  }

  // Prepare data for symptoms chart
  const getSymptomsData = () => {
    const filteredLogs = getFilteredLogs()
    const symptomCounts: Record<string, number> = {}

    filteredLogs.forEach((log) => {
      if (log.symptoms && log.symptoms.length > 0) {
        log.symptoms.forEach((symptom) => {
          if (!symptomCounts[symptom]) {
            symptomCounts[symptom] = 0
          }
          symptomCounts[symptom]++
        })
      }
    })

    return Object.entries(symptomCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Handle month navigation
  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1))
  }

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1))
  }

  // Export data as CSV
  const exportData = () => {
    if (!logs.length) return

    const filteredLogs = getFilteredLogs()
    let csvContent = "Date,Flow,Pain,Mood,Symptoms,Notes\n"

    filteredLogs.forEach((log) => {
      const date = format(log.date instanceof Date ? log.date : new Date(log.date), "yyyy-MM-dd")
      const symptoms = log.symptoms ? log.symptoms.join("; ") : ""
      const notes = log.notes ? `"${log.notes.replace(/"/g, '""')}"` : ""
      csvContent += `${date},${log.flow},${log.pain},${log.mood},"${symptoms}",${notes}\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `period_data_${format(selectedMonth, "yyyy-MM")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="w-full border-pink-100 dark:border-pink-900/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Period Tracking Insights
            </CardTitle>
            <CardDescription>Visualize your menstrual cycle data and identify patterns</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              Previous
            </Button>
            <div className="font-medium px-2">{format(selectedMonth, "MMMM yyyy")}</div>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              Next
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No tracking data available. Start logging your symptoms to see insights.
            </p>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Go to Tracker
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Symptoms</SelectItem>
                    {Array.from(new Set(logs.flatMap((log) => log.symptoms || []))).map((symptom) => (
                      <SelectItem key={symptom} value={symptom}>
                        {symptom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedSymptom !== "all" && (
                  <Badge
                    variant="outline"
                    className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800 flex items-center gap-1"
                  >
                    {selectedSymptom}
                    <button
                      onClick={() => setSelectedSymptom("all")}
                      className="ml-1 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 h-4 w-4 inline-flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={exportData} className="self-end">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" /> Calendar
                </TabsTrigger>
                <TabsTrigger value="flow">
                  <BarChart2 className="h-4 w-4 mr-2" /> Flow
                </TabsTrigger>
                <TabsTrigger value="symptoms">
                  <PieChart className="h-4 w-4 mr-2" /> Symptoms
                </TabsTrigger>
                <TabsTrigger value="mood">
                  <LineChart className="h-4 w-4 mr-2" /> Mood & Pain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="pt-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      month={selectedMonth}
                      onMonthChange={setSelectedMonth}
                      className="rounded-md border"
                      modifiers={{
                        period: logs
                          .filter((log) => log.flow > 0)
                          .map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                        logged: logs.map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                      }}
                      modifiersStyles={{
                        period: {
                          fontWeight: "bold",
                          backgroundColor: "rgba(236, 72, 153, 0.2)",
                          borderRadius: "100%",
                        },
                        logged: {
                          border: "2px solid rgba(236, 72, 153, 0.5)",
                          borderRadius: "100%",
                        },
                      }}
                    />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-lg font-medium mb-4">Cycle Summary</h3>
                    {cycleStats && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Average Cycle Length</p>
                            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                              {cycleStats.avgCycleLength} days
                            </p>
                          </div>
                          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Average Period Length</p>
                            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                              {cycleStats.avgPeriodLength} days
                            </p>
                          </div>
                        </div>

                        {cycleStats.nextPeriodDate && (
                          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Next Period (Estimated)</p>
                            <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                              {format(new Date(cycleStats.nextPeriodDate), "MMMM d, yyyy")}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <InfoIcon className="h-4 w-4" />
                          <p>
                            {cycleStats.hasEnoughData
                              ? "These predictions are based on your logged data."
                              : "Log more cycles for more accurate predictions."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="flow" className="pt-4">
                <div className="h-[400px] w-full">
                  {getFlowData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getFlowData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="flow"
                          name="Flow Intensity"
                          fill="#EC4899"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                          label={{ position: "top", fill: "#EC4899", fontSize: 12 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No flow data available for this month</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="symptoms" className="pt-4">
                <div className="h-[400px] w-full">
                  {getSymptomsData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={getSymptomsData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getSymptomsData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                SYMPTOM_COLORS[entry.name as keyof typeof SYMPTOM_COLORS] ||
                                COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No symptom data available for this month</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="mood" className="pt-4">
                <div className="h-[400px] w-full">
                  {getPainMoodData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={getPainMoodData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis domain={[0, 10]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="pain"
                          name="Pain Level"
                          stroke="#EC4899"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          name="Mood Level"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No mood and pain data available for this month</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  )
}
