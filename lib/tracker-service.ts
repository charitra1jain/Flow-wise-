import type { SymptomLog } from "@/app/tracker/page"

// Enhanced tracker service with better data management and validation
export function saveTrackerLogs(userId: string, logs: SymptomLog[]): void {
  try {
    // Validate logs before saving
    const validatedLogs = logs.map((log) => ({
      ...log,
      date: log.date instanceof Date ? log.date.toISOString() : log.date,
      flow: Math.max(0, Math.min(10, log.flow)),
      pain: Math.max(0, Math.min(10, log.pain)),
      mood: Math.max(1, Math.min(10, log.mood)),
      symptoms: Array.isArray(log.symptoms) ? log.symptoms : [],
      notes: typeof log.notes === "string" ? log.notes : "",
    }))

    localStorage.setItem(`flowwise_tracker_logs_${userId}`, JSON.stringify(validatedLogs))

    // Also save a backup with timestamp
    const backup = {
      logs: validatedLogs,
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    }
    localStorage.setItem(`flowwise_tracker_backup_${userId}`, JSON.stringify(backup))
  } catch (error) {
    console.error("Error saving tracker logs:", error)
    throw new Error("Failed to save tracker data")
  }
}

export function loadTrackerLogs(userId: string): SymptomLog[] {
  try {
    const storedLogs = localStorage.getItem(`flowwise_tracker_logs_${userId}`)
    if (!storedLogs) return []

    const parsedLogs = JSON.parse(storedLogs)

    // Convert date strings back to Date objects and validate
    return parsedLogs
      .map((log: any) => ({
        ...log,
        date: new Date(log.date),
        flow: Number(log.flow) || 0,
        pain: Number(log.pain) || 0,
        mood: Number(log.mood) || 5,
        symptoms: Array.isArray(log.symptoms) ? log.symptoms : [],
        notes: log.notes || "",
      }))
      .filter((log: SymptomLog) => !isNaN(log.date.getTime())) // Filter out invalid dates
  } catch (error) {
    console.error("Error loading tracker logs:", error)
    return []
  }
}

export function getCycleStatistics(userId: string) {
  try {
    const logs = loadTrackerLogs(userId)

    // Filter logs with flow > 0 to identify period days
    const periodLogs = logs.filter((log) => log.flow > 0)

    // Sort logs by date (oldest first)
    periodLogs.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date)
      const dateB = b.date instanceof Date ? b.date : new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    // Need at least 4 period days across 2+ cycles to calculate meaningful statistics
    if (periodLogs.length < 4) {
      return {
        hasEnoughData: false,
        avgCycleLength: null,
        avgPeriodLength: null,
        nextPeriodDate: null,
        totalLogsCount: logs.length,
        periodDaysCount: periodLogs.length,
      }
    }

    // Group consecutive period days to identify distinct periods
    const periods: Date[][] = []
    let currentPeriod: Date[] = []

    for (let i = 0; i < periodLogs.length; i++) {
      const currentDate = periodLogs[i].date instanceof Date ? periodLogs[i].date : new Date(periodLogs[i].date)

      if (i === 0) {
        currentPeriod.push(currentDate)
      } else {
        const prevDate =
          periodLogs[i - 1].date instanceof Date ? periodLogs[i - 1].date : new Date(periodLogs[i - 1].date)

        // If dates are consecutive or within 2 days, consider part of same period
        const dayDiff = Math.abs((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff <= 2) {
          currentPeriod.push(currentDate)
        } else {
          if (currentPeriod.length > 0) {
            periods.push([...currentPeriod])
          }
          currentPeriod = [currentDate]
        }
      }
    }

    // Add the last period if not empty
    if (currentPeriod.length > 0) {
      periods.push(currentPeriod)
    }

    // Need at least 2 distinct periods to calculate cycle length
    if (periods.length < 2) {
      return {
        hasEnoughData: false,
        avgCycleLength: null,
        avgPeriodLength: null,
        nextPeriodDate: null,
        totalLogsCount: logs.length,
        periodDaysCount: periodLogs.length,
      }
    }

    // Calculate average period length
    const periodLengths = periods.map((period) => period.length)
    const avgPeriodLength = Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)

    // Calculate cycle lengths (from start of one period to start of next)
    const cycleLengths = []
    for (let i = 1; i < periods.length; i++) {
      const prevPeriodStart = periods[i - 1][0]
      const currentPeriodStart = periods[i][0]
      const cycleLength = Math.round((currentPeriodStart.getTime() - prevPeriodStart.getTime()) / (1000 * 60 * 60 * 24))

      // Only include reasonable cycle lengths (21-45 days)
      if (cycleLength >= 21 && cycleLength <= 45) {
        cycleLengths.push(cycleLength)
      }
    }

    if (cycleLengths.length === 0) {
      return {
        hasEnoughData: false,
        avgCycleLength: null,
        avgPeriodLength,
        nextPeriodDate: null,
        totalLogsCount: logs.length,
        periodDaysCount: periodLogs.length,
      }
    }

    // Calculate average cycle length
    const avgCycleLength = Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)

    // Predict next period date
    const lastPeriodStart = periods[periods.length - 1][0]
    const nextPeriodDate = new Date(lastPeriodStart)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)

    return {
      hasEnoughData: true,
      avgCycleLength,
      avgPeriodLength,
      nextPeriodDate: nextPeriodDate.toISOString(),
      totalLogsCount: logs.length,
      periodDaysCount: periodLogs.length,
      cycleCount: periods.length,
    }
  } catch (error) {
    console.error("Error calculating cycle statistics:", error)
    return {
      hasEnoughData: false,
      avgCycleLength: null,
      avgPeriodLength: null,
      nextPeriodDate: null,
      totalLogsCount: 0,
      periodDaysCount: 0,
    }
  }
}

export const getMostRecentLog = (userId: string): SymptomLog | null => {
  try {
    const logs = loadTrackerLogs(userId)
    if (!logs || logs.length === 0) return null

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date)
      const dateB = b.date instanceof Date ? b.date : new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })

    return sortedLogs[0]
  } catch (error) {
    console.error("Error getting most recent log:", error)
    return null
  }
}

export const getSymptomPatterns = (userId: string) => {
  try {
    const logs = loadTrackerLogs(userId)
    if (!logs || logs.length < 5) {
      return {
        hasEnoughData: false,
        commonSymptoms: [],
        symptomFrequency: {},
      }
    }

    const symptomCounts: { [symptom: string]: number } = {}
    const totalDays = logs.length

    logs.forEach((log) => {
      if (log.symptoms && log.symptoms.length > 0) {
        log.symptoms.forEach((symptom) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
        })
      }
    })

    const sortedSymptoms = Object.entries(symptomCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([symptom, count]) => ({
        symptom,
        count,
        frequency: Math.round((count / totalDays) * 100),
      }))

    return {
      hasEnoughData: true,
      commonSymptoms: sortedSymptoms.slice(0, 5).map((item) => item.symptom),
      symptomFrequency: symptomCounts,
      detailedSymptoms: sortedSymptoms,
    }
  } catch (error) {
    console.error("Error getting symptom patterns:", error)
    return {
      hasEnoughData: false,
      commonSymptoms: [],
      symptomFrequency: {},
    }
  }
}

export const deleteTrackerLog = (userId: string, date: Date): boolean => {
  try {
    const logs = loadTrackerLogs(userId)
    const filteredLogs = logs.filter((log) => {
      const logDate = log.date instanceof Date ? log.date : new Date(log.date)
      return logDate.toDateString() !== date.toDateString()
    })

    saveTrackerLogs(userId, filteredLogs)
    return true
  } catch (error) {
    console.error("Error deleting tracker log:", error)
    return false
  }
}

export const exportTrackerData = (userId: string, format: "csv" | "json" = "csv"): string => {
  try {
    const logs = loadTrackerLogs(userId)

    if (format === "json") {
      return JSON.stringify(logs, null, 2)
    }

    // CSV format
    let csvContent = "Date,Flow,Pain,Mood,Symptoms,Notes\n"

    logs.forEach((log) => {
      const date = log.date instanceof Date ? log.date.toISOString().split("T")[0] : log.date
      const symptoms = log.symptoms ? log.symptoms.join("; ") : ""
      const notes = log.notes ? `"${log.notes.replace(/"/g, '""')}"` : ""
      csvContent += `${date},${log.flow},${log.pain},${log.mood},"${symptoms}",${notes}\n`
    })

    return csvContent
  } catch (error) {
    console.error("Error exporting tracker data:", error)
    return ""
  }
}
