import type { SymptomLog } from "@/app/tracker/page"

// Type for the tracker data storage
export type TrackerStorage = {
  userId: string
  logs: SymptomLog[]
  lastUpdated: string
}

// Function to save logs to localStorage
export const saveTrackerLogs = (userId: string, logs: SymptomLog[]): void => {
  if (typeof window === "undefined") return

  try {
    const serializedLogs = logs.map((log) => ({
      ...log,
      date: log.date instanceof Date ? log.date.toISOString() : new Date(log.date).toISOString(),
    }))

    const storage: TrackerStorage = {
      userId,
      logs: serializedLogs as any, // Type assertion needed due to date serialization
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(`flowwise_tracker_${userId}`, JSON.stringify(storage))
    console.log("Saved tracker logs to localStorage")
  } catch (error) {
    console.error("Error saving tracker logs:", error)
  }
}

// Function to load logs from localStorage
export const loadTrackerLogs = (userId: string): SymptomLog[] => {
  if (typeof window === "undefined") return []

  try {
    const storedData = localStorage.getItem(`flowwise_tracker_${userId}`)
    if (!storedData) return []

    const storage: TrackerStorage = JSON.parse(storedData)

    // Ensure we properly convert date strings back to Date objects
    return storage.logs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
    }))
  } catch (error) {
    console.error("Error loading tracker logs:", error)
    return []
  }
}

// Function to get the most recent log
export const getMostRecentLog = (userId: string): SymptomLog | null => {
  const logs = loadTrackerLogs(userId)
  if (logs.length === 0) return null

  // Sort logs by date (newest first)
  logs.sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date)
    const dateB = b.date instanceof Date ? b.date : new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  return logs[0]
}

// Function to get logs for a specific date range
export const getLogsInDateRange = (userId: string, startDate: Date, endDate: Date): SymptomLog[] => {
  const logs = loadTrackerLogs(userId)

  return logs.filter((log) => {
    const logDate = log.date instanceof Date ? log.date.getTime() : new Date(log.date).getTime()
    return logDate >= startDate.getTime() && logDate <= endDate.getTime()
  })
}

// Function to get cycle statistics
export const getCycleStatistics = (userId: string) => {
  const logs = loadTrackerLogs(userId)
  if (logs.length === 0) return null

  // Sort logs by date (oldest first)
  logs.sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date)
    const dateB = b.date instanceof Date ? b.date : new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  // Find days with flow > 0 to identify period days
  const periodDays = logs.filter((log) => log.flow > 0)

  // Calculate average cycle length if we have enough data
  if (periodDays.length >= 2) {
    const cycleLengths = []
    for (let i = 1; i < periodDays.length; i++) {
      const prevDate =
        periodDays[i - 1].date instanceof Date ? periodDays[i - 1].date : new Date(periodDays[i - 1].date)
      const currDate = periodDays[i].date instanceof Date ? periodDays[i].date : new Date(periodDays[i].date)

      const daysBetween = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysBetween > 14 && daysBetween < 45) {
        // Filter out unlikely cycle lengths
        cycleLengths.push(daysBetween)
      }
    }

    // Calculate average cycle length
    const avgCycleLength =
      cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
        : 28 // Default to 28 if we can't calculate

    // Calculate average period length
    const periodGroups = []
    let currentGroup = [periodDays[0]]

    for (let i = 1; i < periodDays.length; i++) {
      const prevDate =
        periodDays[i - 1].date instanceof Date ? periodDays[i - 1].date : new Date(periodDays[i - 1].date)
      const currDate = periodDays[i].date instanceof Date ? periodDays[i].date : new Date(periodDays[i].date)

      const daysBetween = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysBetween <= 2) {
        // Consider consecutive or 1 day gap as same period
        currentGroup.push(periodDays[i])
      } else {
        periodGroups.push([...currentGroup])
        currentGroup = [periodDays[i]]
      }
    }

    if (currentGroup.length > 0) {
      periodGroups.push(currentGroup)
    }

    const avgPeriodLength =
      periodGroups.length > 0
        ? Math.round(periodGroups.reduce((sum, group) => sum + group.length, 0) / periodGroups.length)
        : 5 // Default to 5 if we can't calculate

    // Predict next period
    const lastPeriodStart =
      periodDays[periodDays.length - 1].date instanceof Date
        ? periodDays[periodDays.length - 1].date
        : new Date(periodDays[periodDays.length - 1].date)
    const nextPeriodDate = new Date(lastPeriodStart)
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)

    return {
      avgCycleLength,
      avgPeriodLength,
      lastPeriodStart,
      nextPeriodDate,
      periodCount: periodGroups.length,
      hasEnoughData: true,
    }
  }

  return {
    avgCycleLength: 28,
    avgPeriodLength: 5,
    lastPeriodStart:
      periodDays.length > 0
        ? periodDays[periodDays.length - 1].date instanceof Date
          ? periodDays[periodDays.length - 1].date
          : new Date(periodDays[periodDays.length - 1].date)
        : null,
    nextPeriodDate: null,
    periodCount: 0,
    hasEnoughData: false,
  }
}

// Function to get symptom patterns
export const getSymptomPatterns = (userId: string) => {
  const logs = loadTrackerLogs(userId)
  if (logs.length < 5) return null // Need enough data to identify patterns

  // Count symptom occurrences
  const symptomCounts = {}
  logs.forEach((log) => {
    if (log.symptoms) {
      log.symptoms.forEach((symptom) => {
        if (!symptomCounts[symptom]) {
          symptomCounts[symptom] = 0
        }
        symptomCounts[symptom]++
      })
    }
  })

  // Find most common symptoms
  const commonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom]) => symptom)

  return {
    commonSymptoms,
    hasEnoughData: logs.length >= 5,
  }
}
