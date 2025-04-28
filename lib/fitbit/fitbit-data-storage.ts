export interface FitbitHealthData {
  date: string
  activity: {
    steps: number
    activeMinutes: number
    sedentaryMinutes: number
    caloriesBurned: number
  }
  sleep: {
    minutesAsleep: number
    timeInBed: number
    efficiency: number
  }
  heart: {
    restingHeartRate: number
    zones: {
      outOfRange: number
      fatBurn: number
      cardio: number
      peak: number
    }
  }
}

// Save Fitbit health data to localStorage
export const saveFitbitHealthData = (userId: string, data: FitbitHealthData): void => {
  if (typeof window === "undefined") return

  try {
    // Get existing data
    const existingDataJson = localStorage.getItem(`fitbit_health_data_${userId}`)
    const existingData: FitbitHealthData[] = existingDataJson ? JSON.parse(existingDataJson) : []

    // Check if data for this date already exists
    const dateIndex = existingData.findIndex((item) => item.date === data.date)

    if (dateIndex >= 0) {
      // Update existing data
      existingData[dateIndex] = data
    } else {
      // Add new data
      existingData.push(data)
    }

    // Sort by date (newest first)
    existingData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Keep only the last 30 days of data
    const recentData = existingData.slice(0, 30)

    // Save to localStorage
    localStorage.setItem(`fitbit_health_data_${userId}`, JSON.stringify(recentData))
  } catch (error) {
    console.error("Error saving Fitbit health data:", error)
  }
}

// Load Fitbit health data from localStorage
export const loadFitbitHealthData = (userId: string): FitbitHealthData[] => {
  if (typeof window === "undefined") return []

  try {
    const dataJson = localStorage.getItem(`fitbit_health_data_${userId}`)
    return dataJson ? JSON.parse(dataJson) : []
  } catch (error) {
    console.error("Error loading Fitbit health data:", error)
    return []
  }
}

// Get the most recent Fitbit health data
export const getMostRecentFitbitHealthData = (userId: string): FitbitHealthData | null => {
  if (typeof window === "undefined") return null

  try {
    const allData = loadFitbitHealthData(userId)
    return allData.length > 0 ? allData[0] : null
  } catch (error) {
    console.error("Error getting most recent Fitbit health data:", error)
    return null
  }
}

// Process raw Fitbit API data into our storage format
export const processFitbitData = (rawData: any): FitbitHealthData => {
  return {
    date: rawData.date,
    activity: {
      steps: rawData.activity?.steps || 0,
      activeMinutes: (rawData.activity?.fairlyActiveMinutes || 0) + (rawData.activity?.veryActiveMinutes || 0),
      sedentaryMinutes: rawData.activity?.sedentaryMinutes || 0,
      caloriesBurned: rawData.activity?.caloriesOut || 0,
    },
    sleep: {
      minutesAsleep: rawData.sleep?.totalMinutesAsleep || 0,
      timeInBed: rawData.sleep?.totalTimeInBed || 0,
      efficiency:
        rawData.sleep?.totalMinutesAsleep && rawData.sleep?.totalTimeInBed
          ? Math.round((rawData.sleep.totalMinutesAsleep / rawData.sleep.totalTimeInBed) * 100)
          : 0,
    },
    heart: {
      restingHeartRate: rawData.heart?.restingHeartRate || 0,
      zones: {
        outOfRange: rawData.heart?.heartRateZones?.find((z: any) => z.name === "Out of Range")?.minutes || 0,
        fatBurn: rawData.heart?.heartRateZones?.find((z: any) => z.name === "Fat Burn")?.minutes || 0,
        cardio: rawData.heart?.heartRateZones?.find((z: any) => z.name === "Cardio")?.minutes || 0,
        peak: rawData.heart?.heartRateZones?.find((z: any) => z.name === "Peak")?.minutes || 0,
      },
    },
  }
}
