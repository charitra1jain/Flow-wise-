import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, history, user } = await req.json()

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Create a system prompt
    let systemPrompt = `You are FlowWise AI, a helpful assistant specializing in menstrual health education. 
    Provide accurate, educational information about menstrual health, periods, and related topics.
    Be supportive, informative, and empathetic in your responses.
    If asked about medical issues, remind users to consult healthcare professionals for personalized advice.
    Keep responses concise but informative.`

    if (user) {
      systemPrompt += `\n\nYou are speaking with ${user.name} (${user.email}).`
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
            maxOutputTokens: 1024,
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
