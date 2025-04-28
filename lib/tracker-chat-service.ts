import { loadTrackerLogs, getCycleStatistics, getSymptomPatterns } from "@/lib/tracker-service"

// Function to get tracker data for the chatbot
export const getTrackerDataForChat = (userId: string) => {
  if (!userId) return null

  try {
    // Get all logs
    const logs = loadTrackerLogs(userId)
    if (logs.length === 0) return null

    // Get most recent log
    const recentLog = logs[0] // Logs are already sorted by date (newest first)

    // Get cycle statistics
    const cycleStats = getCycleStatistics(userId)

    // Get symptom patterns
    const symptomPatterns = getSymptomPatterns(userId)

    return {
      hasData: true,
      recentLog,
      cycleStats,
      symptomPatterns,
      logCount: logs.length,
    }
  } catch (error) {
    console.error("Error getting tracker data for chat:", error)
    return null
  }
}

// Function to get a summary of tracker data for the chatbot
export const getTrackerSummaryForChat = (userId: string): string => {
  const data = getTrackerDataForChat(userId)
  if (!data) return "No tracker data available."

  let summary = "Based on your tracking data:\n\n"

  // Add recent log info
  if (data.recentLog) {
    const recentDate = data.recentLog.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    summary += `Your most recent log (${recentDate}):\n`
    summary += `- Flow: ${data.recentLog.flow}/10\n`
    summary += `- Pain: ${data.recentLog.pain}/10\n`
    summary += `- Mood: ${data.recentLog.mood}/10\n`

    if (data.recentLog.symptoms.length > 0) {
      summary += `- Symptoms: ${data.recentLog.symptoms.join(", ")}\n`
    }

    if (data.recentLog.notes) {
      summary += `- Notes: ${data.recentLog.notes}\n`
    }

    summary += "\n"
  }

  // Add cycle statistics
  if (data.cycleStats && data.cycleStats.hasEnoughData) {
    summary += "Cycle statistics:\n"
    summary += `- Average cycle length: ${data.cycleStats.avgCycleLength} days\n`
    summary += `- Average period length: ${data.cycleStats.avgPeriodLength} days\n`

    if (data.cycleStats.nextPeriodDate) {
      const nextPeriodDate = data.cycleStats.nextPeriodDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      summary += `- Next period predicted: ${nextPeriodDate}\n`
    }

    summary += "\n"
  }

  // Add symptom patterns
  if (data.symptomPatterns && data.symptomPatterns.hasEnoughData) {
    summary += "Common symptoms:\n"
    summary += `- ${data.symptomPatterns.commonSymptoms.join("\n- ")}\n\n`
  }

  return summary
}

// Function to get personalized questions based on tracker data
export const getPersonalizedQuestions = (userId: string): string[] => {
  const data = getTrackerDataForChat(userId)
  if (!data) return []

  const questions: string[] = []

  // Add questions based on recent log
  if (data.recentLog) {
    if (data.recentLog.pain > 5) {
      questions.push("What can help with my period pain?")
    }

    if (data.recentLog.mood < 4) {
      questions.push("How can I improve my mood during my period?")
    }

    if (data.recentLog.symptoms.includes("Bloating")) {
      questions.push("What can I do to reduce bloating during my period?")
    }

    if (data.recentLog.symptoms.includes("Fatigue")) {
      questions.push("Why do I feel so tired during my period and what can I do about it?")
    }
  }

  // Add questions based on cycle statistics
  if (data.cycleStats && data.cycleStats.hasEnoughData) {
    questions.push("When is my next period likely to start?")
    questions.push("Is my cycle length normal?")
  }

  // Add general questions if we don't have enough personalized ones
  if (questions.length < 3) {
    questions.push("What causes menstrual cramps?")
    questions.push("How can I track my cycle more effectively?")
    questions.push("What are the different phases of the menstrual cycle?")
    questions.push("How does diet affect my menstrual cycle?")
  }

  // Shuffle and return 3 questions
  return questions.sort(() => 0.5 - Math.random()).slice(0, 3)
}
