import type { SymptomLog } from "@/app/tracker/page"
import { addDays, differenceInDays, isWithinInterval } from "date-fns"

// Save tracker logs to localStorage
export function saveTrackerLogs(userId: string, logs: SymptomLog[]): void {
  try {
    // Convert Date objects to ISO strings for storage
    const logsToSave = logs.map((log) => ({
      ...log,
      date: log.date instanceof Date ? log.date.toISOString() : log.date,
    }))
    localStorage.setItem(`tracker_logs_${userId}`, JSON.stringify(logsToSave))
  } catch (error) {
    console.error("Error saving tracker logs:", error)
  }
}

// Load tracker logs from localStorage
export function loadTrackerLogs(userId: string): SymptomLog[] {
  try {
    const storedLogs = localStorage.getItem(`tracker_logs_${userId}`)
    if (!storedLogs) return []

    // Convert ISO strings back to Date objects
    const parsedLogs = JSON.parse(storedLogs)
    return parsedLogs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
    }))
  } catch (error) {
    console.error("Error loading tracker logs:", error)
    return []
  }
}

// Calculate cycle statistics
export function getCycleStatistics(userId: string) {
  try {
    const logs = loadTrackerLogs(userId)
    if (!logs || logs.length === 0) return null

    // Sort logs by date (oldest first)
    const sortedLogs = [...logs].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date)
      const dateB = b.date instanceof Date ? b.date : new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    // Find period start dates (days with flow > 0)
    const periodStartDates = sortedLogs
      .filter((log) => log.flow > 0)
      .map((log) => (log.date instanceof Date ? log.date : new Date(log.date)))
      .sort((a, b) => a.getTime() - b.getTime())

    if (periodStartDates.length < 2) {
      return {
        hasEnoughData: false,
        avgCycleLength: "N/A",
        avgPeriodLength: "N/A",
      }
    }

    // Calculate cycle lengths (days between period starts)
    const cycleLengths = []
    for (let i = 1; i < periodStartDates.length; i++) {
      const cycleLength = differenceInDays(periodStartDates[i], periodStartDates[i - 1])
      if (cycleLength > 0 && cycleLength < 45) {
        // Filter out unrealistic cycle lengths
        cycleLengths.push(cycleLength)
      }
    }

    // Calculate average cycle length
    const avgCycleLength =
      cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
        : 28

    // Calculate period lengths
    const periodLengths = []
    for (let i = 0; i < periodStartDates.length; i++) {
      const periodStart = periodStartDates[i]
      const periodLogs = sortedLogs.filter((log) => {
        const logDate = log.date instanceof Date ? log.date : new Date(log.date)
        return (
          log.flow > 0 &&
          isWithinInterval(logDate, {
            start: periodStart,
            end: addDays(periodStart, 10), // Look up to 10 days after period start
          })
        )
      })

      if (periodLogs.length > 0) {
        // Sort period logs by date
        const sortedPeriodLogs = periodLogs.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date)
          const dateB = b.date instanceof Date ? b.date : new Date(b.date)
          return dateA.getTime() - dateB.getTime()
        })

        // Calculate consecutive days with flow
        let periodLength = 1
        for (let j = 1; j < sortedPeriodLogs.length; j++) {
          const prevDate =
            sortedPeriodLogs[j - 1].date instanceof Date
              ? sortedPeriodLogs[j - 1].date
              : new Date(sortedPeriodLogs[j - 1].date)
          const currDate =
            sortedPeriodLogs[j].date instanceof Date ? sortedPeriodLogs[j].date : new Date(sortedPeriodLogs[j].date)
          const dayDiff = differenceInDays(currDate, prevDate)

          if (dayDiff === 1) {
            periodLength++
          } else {
            break
          }
        }

        periodLengths.push(periodLength)
      }
    }

    // Calculate average period length
    const avgPeriodLength =
      periodLengths.length > 0
        ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
        : 5

    // Predict next period
    let nextPeriodDate = null
    if (periodStartDates.length > 0) {
      const lastPeriodStart = periodStartDates[periodStartDates.length - 1]
      nextPeriodDate = addDays(lastPeriodStart, avgCycleLength)
    }

    return {
      hasEnoughData: cycleLengths.length >= 2,
      avgCycleLength,
      avgPeriodLength,
      nextPeriodDate,
    }
  } catch (error) {
    console.error("Error calculating cycle statistics:", error)
    return null
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
      }
    }

    const symptomCounts: { [symptom: string]: number } = {}

    logs.forEach((log) => {
      if (log.symptoms && log.symptoms.length > 0) {
        log.symptoms.forEach((symptom) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
        })
      }
    })

    const sortedSymptoms = Object.entries(symptomCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([symptom]) => symptom)

    return {
      hasEnoughData: true,
      commonSymptoms: sortedSymptoms.slice(0, 5), // Return top 5 symptoms
    }
  } catch (error) {
    console.error("Error getting symptom patterns:", error)
    return {
      hasEnoughData: false,
      commonSymptoms: [],
    }
  }
}
