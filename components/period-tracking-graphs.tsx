"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { InfoIcon, Download, CalendarIcon, BarChart2, PieChart, TrendingUp, Activity } from "lucide-react"
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
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"

// Define colors for charts
const COLORS = [
  "#EC4899",
  "#F472B6",
  "#F9A8D4",
  "#FBC7E0",
  "#FBCFE8",
  "#D946EF",
  "#C026D3",
  "#A855F7",
  "#8B5CF6",
  "#7C3AED",
]

const SYMPTOM_COLORS: Record<string, string> = {
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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg border-flowwise-lightPink/30">
        <p className="font-medium text-sm mb-2 text-flowwise-burgundy dark:text-flowwise-pink">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
            {entry.name === "Flow" && " (0-10)"}
            {entry.name === "Pain" && " (0-10)"}
            {entry.name === "Mood" && " (1-10)"}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function PeriodTrackingGraphs() {
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [cycleStats, setCycleStats] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [selectedSymptom, setSelectedSymptom] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [timeRange, setTimeRange] = useState<string>("3months")
  const { toast } = useToast()
  const { user } = useAuth()

  // Load logs from storage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const storedLogs = loadTrackerLogs(user.id)
        if (storedLogs && storedLogs.length > 0) {
          const fixedLogs = storedLogs.map((log) => ({
            ...log,
            date: log.date instanceof Date ? log.date : new Date(log.date),
          }))
          setLogs(fixedLogs)

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

  // Get filtered logs based on time range
  const getFilteredLogsByTimeRange = () => {
    if (!logs.length) return []

    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case "1month":
        startDate = subMonths(now, 1)
        break
      case "3months":
        startDate = subMonths(now, 3)
        break
      case "6months":
        startDate = subMonths(now, 6)
        break
      case "1year":
        startDate = subMonths(now, 12)
        break
      default:
        startDate = subMonths(now, 3)
    }

    return logs
      .filter((log) => {
        const logDate = log.date instanceof Date ? log.date : new Date(log.date)
        return logDate >= startDate && logDate <= now
      })
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
  }

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

  // Prepare data for comprehensive overview chart
  const getOverviewData = () => {
    const filteredLogs = getFilteredLogsByTimeRange()
    return filteredLogs.map((log) => ({
      date: format(log.date instanceof Date ? log.date : new Date(log.date), "MMM d"),
      fullDate: log.date instanceof Date ? log.date : new Date(log.date),
      flow: log.flow,
      pain: log.pain,
      mood: log.mood,
      symptomCount: log.symptoms ? log.symptoms.length : 0,
    }))
  }

  // Prepare data for flow intensity chart
  const getFlowData = () => {
    const filteredLogs = getFilteredLogsByTimeRange()
    return filteredLogs
      .filter((log) => log.flow > 0)
      .map((log) => ({
        date: format(log.date instanceof Date ? log.date : new Date(log.date), "MMM d"),
        flow: log.flow,
        flowLabel: getFlowLabel(log.flow),
      }))
  }

  // Prepare data for pain and mood correlation
  const getPainMoodData = () => {
    const filteredLogs = getFilteredLogsByTimeRange()
    return filteredLogs.map((log) => ({
      date: format(log.date instanceof Date ? log.date : new Date(log.date), "MMM d"),
      pain: log.pain,
      mood: log.mood,
      flow: log.flow,
    }))
  }

  // Prepare data for symptoms distribution
  const getSymptomsData = () => {
    const filteredLogs = getFilteredLogsByTimeRange()
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

    return Object.entries(symptomCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / filteredLogs.length) * 100),
      }))
      .sort((a, b) => b.value - a.value)
  }

  // Helper functions
  const getFlowLabel = (value: number) => {
    if (value === 0) return "None"
    if (value <= 3) return "Light"
    if (value <= 7) return "Moderate"
    return "Heavy"
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

    const filteredLogs = getFilteredLogsByTimeRange()
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
    link.setAttribute("download", `period_analytics_${timeRange}_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Analytics exported",
      description: "Your analytics data has been exported successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-flowwise-lightPink/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                Advanced Analytics
              </CardTitle>
              <CardDescription>Visualize your menstrual cycle data and identify patterns over time</CardDescription>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] border-flowwise-lightPink/30">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                disabled={logs.length === 0}
                className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">No tracking data available for analytics.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Start logging your symptoms to see detailed charts and insights about your cycle.
              </p>
              <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Start Tracking
              </Button>
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <TabsTrigger value="overview">
                    <TrendingUp className="h-4 w-4 mr-2" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="flow">
                    <BarChart2 className="h-4 w-4 mr-2" /> Flow
                  </TabsTrigger>
                  <TabsTrigger value="symptoms">
                    <PieChart className="h-4 w-4 mr-2" /> Symptoms
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <CalendarIcon className="h-4 w-4 mr-2" /> Calendar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4 bg-flowwise-mint/10 border-flowwise-mint/30">
                        <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                          {getFilteredLogsByTimeRange().length}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Tracked</div>
                      </Card>
                      <Card className="p-4 bg-flowwise-mint/10 border-flowwise-mint/30">
                        <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                          {getFilteredLogsByTimeRange().filter((log) => log.flow > 0).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Period Days</div>
                      </Card>
                      <Card className="p-4 bg-flowwise-mint/10 border-flowwise-mint/30">
                        <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                          {getSymptomsData().length}
                        </div>
                        <div className="text-sm text-muted-foreground">Unique Symptoms</div>
                      </Card>
                      <Card className="p-4 bg-flowwise-mint/10 border-flowwise-mint/30">
                        <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                          {Math.round(
                            getFilteredLogsByTimeRange().reduce((sum, log) => sum + log.mood, 0) /
                              getFilteredLogsByTimeRange().length,
                          ) || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Mood</div>
                      </Card>
                    </div>

                    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                      <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                        Comprehensive Overview
                      </h3>
                      <div className="h-[400px] w-full">
                        {getOverviewData().length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={getOverviewData()}
                              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" opacity={0.3} />
                              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} stroke="#9D174D" />
                              <YAxis yAxisId="left" domain={[0, 10]} stroke="#9D174D" />
                              <YAxis yAxisId="right" orientation="right" domain={[0, 15]} stroke="#9D174D" />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="flow"
                                name="Flow"
                                fill="#EC4899"
                                fillOpacity={0.3}
                                stroke="#EC4899"
                                strokeWidth={2}
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="pain"
                                name="Pain"
                                stroke="#F472B6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="mood"
                                name="Mood"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Bar
                                yAxisId="right"
                                dataKey="symptomCount"
                                name="Symptom Count"
                                fill="#F9A8D4"
                                opacity={0.7}
                                barSize={20}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">No data available for the selected time range</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="flow" className="pt-6">
                  <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                    <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                      Flow Intensity Over Time
                    </h3>
                    <div className="h-[400px] w-full">
                      {getFlowData().length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={getFlowData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" opacity={0.3} />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} stroke="#9D174D" />
                            <YAxis domain={[0, 10]} stroke="#9D174D" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="flow"
                              name="Flow Intensity"
                              fill="#EC4899"
                              fillOpacity={0.6}
                              stroke="#EC4899"
                              strokeWidth={3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No flow data available for the selected time range</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="symptoms" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                      <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                        Symptom Distribution
                      </h3>
                      <div className="h-[400px] w-full">
                        {getSymptomsData().length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={getSymptomsData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name} (${percentage}%)`}
                                outerRadius={120}
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
                            <p className="text-muted-foreground">No symptom data available</p>
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                      <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                        Pain vs Mood Correlation
                      </h3>
                      <div className="h-[400px] w-full">
                        {getPainMoodData().length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={getPainMoodData()}
                              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#F9A8D4" opacity={0.3} />
                              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} stroke="#9D174D" />
                              <YAxis domain={[0, 10]} stroke="#9D174D" />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="pain"
                                name="Pain Level"
                                stroke="#EC4899"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="mood"
                                name="Mood Level"
                                stroke="#8B5CF6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                              />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">No mood and pain data available</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  <Card className="mt-6 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                    <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                      Most Common Symptoms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getSymptomsData()
                        .slice(0, 6)
                        .map((symptom, index) => (
                          <div
                            key={symptom.name}
                            className="p-4 bg-flowwise-mint/10 rounded-lg border border-flowwise-mint/30"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">
                                  {symptom.name}
                                </div>
                                <div className="text-sm text-muted-foreground">{symptom.value} occurrences</div>
                              </div>
                              <div className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                                {symptom.percentage}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="calendar" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreviousMonth}
                          className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                        >
                          Previous
                        </Button>
                        <div className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">
                          {format(selectedMonth, "MMMM yyyy")}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextMonth}
                          className="border-flowwise-lightPink/50 hover:bg-flowwise-pink/10"
                        >
                          Next
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={new Date()}
                        month={selectedMonth}
                        onMonthChange={setSelectedMonth}
                        className="rounded-md border border-flowwise-lightPink/30"
                        modifiers={{
                          period: logs
                            .filter((log) => log.flow > 0)
                            .map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                          logged: logs.map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                          highPain: logs
                            .filter((log) => log.pain >= 7)
                            .map((log) => (log.date instanceof Date ? log.date : new Date(log.date))),
                        }}
                        modifiersStyles={{
                          period: {
                            fontWeight: "bold",
                            backgroundColor: "rgba(236, 72, 153, 0.3)",
                            borderRadius: "100%",
                          },
                          logged: {
                            border: "2px solid rgba(236, 72, 153, 0.5)",
                            borderRadius: "100%",
                          },
                          highPain: {
                            backgroundColor: "rgba(239, 68, 68, 0.3)",
                            borderRadius: "100%",
                          },
                        }}
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-flowwise-pink/30"></div>
                          <span>Period days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-flowwise-pink/50"></div>
                          <span>Logged days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-300"></div>
                          <span>High pain days</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-flowwise-lightPink/30">
                      <h3 className="text-lg font-medium mb-4 text-flowwise-burgundy dark:text-flowwise-pink">
                        Cycle Summary
                      </h3>
                      {cycleStats && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                              <p className="text-sm text-muted-foreground">Average Cycle Length</p>
                              <p className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                                {cycleStats.avgCycleLength || "N/A"} {cycleStats.avgCycleLength ? "days" : ""}
                              </p>
                            </div>
                            <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                              <p className="text-sm text-muted-foreground">Average Period Length</p>
                              <p className="text-2xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
                                {cycleStats.avgPeriodLength || "N/A"} {cycleStats.avgPeriodLength ? "days" : ""}
                              </p>
                            </div>
                          </div>

                          {cycleStats.nextPeriodDate && (
                            <div className="bg-flowwise-mint/10 p-4 rounded-lg border border-flowwise-mint/30">
                              <p className="text-sm text-muted-foreground">Next Period (Estimated)</p>
                              <p className="text-xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">
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
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
