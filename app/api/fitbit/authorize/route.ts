import { NextResponse } from "next/server"

// Simple route that just returns a JSON response
export async function GET() {
  try {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)

    // Get client ID from environment variable or use a default for testing
    const clientId = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || "23Q8CR"

    // Define redirect URI - use environment variable or fallback
    const redirectUri = process.env.NEXT_PUBLIC_FITBIT_REDIRECT_URI || "http://localhost:3000/fitbit/callback"

    // Define scopes
    const scopes = ["activity", "heartrate", "profile", "sleep"].join(" ")

    // Construct the authorization URL manually
    const authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

    // Return a simple JSON response with the URL
    return NextResponse.json({
      success: true,
      authUrl,
      message: "Authorization URL generated successfully",
    })
  } catch (error) {
    console.error("Error in Fitbit authorize route:", error)

    // Return a simple error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate authorization URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
