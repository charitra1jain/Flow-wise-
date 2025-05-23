import { type NextRequest, NextResponse } from "next/server"
import { getMostRecentLog, getCycleStatistics, getSymptomPatterns } from "@/lib/tracker-service"

export async function POST(req: NextRequest) {
  try {
    const { message, history, user, fitbitData, responseMode = "detailed" } = await req.json()

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Create a system prompt
    let systemPrompt = `You are FlowWise AI, a helpful assistant specializing in menstrual health education. 
    Provide accurate, educational information about menstrual health, periods, and related topics.
    Be supportive, informative, and empathetic in your responses.
    If asked about medical issues, remind users to consult healthcare professionals for personalized advice.`

    // Add response mode instruction
    if (responseMode === "concise") {
      systemPrompt += `\n\nProvide concise, to-the-point responses that are brief but informative. Keep your answers short and focused on the most important information.`
    } else {
      systemPrompt += `\n\nProvide detailed, comprehensive responses with thorough explanations and context. Feel free to elaborate on topics to provide a complete understanding.`
    }

    if (user) {
      systemPrompt += `\n\nYou are speaking with ${user.name} (${user.email}).`

      // Add tracker data if available
      if (user.id) {
        const recentLog = getMostRecentLog(user.id)
        const cycleStats = getCycleStatistics(user.id)
        const symptomPatterns = getSymptomPatterns(user.id)

        if (recentLog) {
          const formattedDate = recentLog.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          systemPrompt += `\n\nThe user has logged their symptoms in the tracker. Here is their most recent log from ${formattedDate}:
          - Flow intensity: ${recentLog.flow}/10
          - Pain level: ${recentLog.pain}/10
          - Mood: ${recentLog.mood}/10
          - Other symptoms: ${recentLog.symptoms.join(", ") || "None"}
          - Notes: ${recentLog.notes || "None"}`
        }

        if (cycleStats && cycleStats.hasEnoughData) {
          const nextPeriodFormatted = cycleStats.nextPeriodDate?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          systemPrompt += `\n\nBased on the user's tracked data:
          - Average cycle length: ${cycleStats.avgCycleLength} days
          - Average period length: ${cycleStats.avgPeriodLength} days
          - Next period predicted to start around: ${nextPeriodFormatted || "Unknown"}`
        }

        if (symptomPatterns && symptomPatterns.hasEnoughData) {
          systemPrompt += `\n\nThe user's most common symptoms are: ${symptomPatterns.commonSymptoms.join(", ")}`
        }

        systemPrompt += `\n\nUse this information to provide personalized insights about their menstrual cycle and symptoms. When appropriate, reference their tracked data to make your responses more relevant to their specific situation.`
      }
    }

    // Add Fitbit data context if available
    if (fitbitData) {
      systemPrompt += `\n\nThe user has connected their Fitbit account. Here is their most recent health data from ${fitbitData.date}:
      - Steps: ${fitbitData.activity.steps}
      - Active minutes: ${fitbitData.activity.activeMinutes}
      - Sedentary minutes: ${fitbitData.activity.sedentaryMinutes}
      - Calories burned: ${fitbitData.activity.caloriesBurned}
      - Sleep duration: ${fitbitData.sleep.minutesAsleep} minutes
      - Sleep efficiency: ${fitbitData.sleep.efficiency}%
      - Resting heart rate: ${fitbitData.heart.restingHeartRate} bpm
      
      Use this information to provide personalized insights about how their physical activity, sleep, and heart rate may relate to their menstrual cycle and overall health. When appropriate, suggest how changes in these metrics might correlate with different phases of their menstrual cycle.`
    }

    // Format the conversation for the Gemini API
    const formattedMessages = []

    // Add the system prompt as the first user message
    formattedMessages.push({
      role: "user",
      parts: [{ text: systemPrompt }],
    })

    // Add a model response to the system prompt
    formattedMessages.push({
      role: "model",
      parts: [{ text: "I understand my role as FlowWise AI. How can I help with menstrual health today?" }],
    })

    // Add conversation history
    if (history && history.length > 0) {
      // Skip the first welcome message to avoid duplication
      const relevantHistory = history.slice(1)

      for (const msg of relevantHistory) {
        formattedMessages.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })
      }
    }

    // Add the current message
    formattedMessages.push({
      role: "user",
      parts: [{ text: message }],
    })

    // Call the Gemini API with the latest model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: responseMode === "concise" ? 512 : 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", errorData)
      return NextResponse.json({ error: "Failed to get response from Gemini API" }, { status: response.status })
    }

    const data = await response.json()

    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response."

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
