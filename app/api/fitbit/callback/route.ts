import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForToken } from "@/lib/fitbit/fitbit-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Handle error from Fitbit OAuth
    if (error) {
      console.error("Fitbit OAuth error:", error)
      return NextResponse.redirect(new URL("/fitbit/error?error=" + encodeURIComponent(error), request.url))
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing required parameters:", { code, state })
      return NextResponse.redirect(
        new URL("/fitbit/error?error=" + encodeURIComponent("Missing required parameters"), request.url),
      )
    }

    // Exchange code for token
    try {
      const tokens = await exchangeCodeForToken(code)

      // Redirect to success page with tokens
      const successUrl = new URL("/fitbit/success", request.url)
      successUrl.searchParams.append("tokens", JSON.stringify(tokens))
      successUrl.searchParams.append("state", state)

      return NextResponse.redirect(successUrl)
    } catch (tokenError) {
      console.error("Error exchanging code for token:", tokenError)
      return NextResponse.redirect(
        new URL("/fitbit/error?error=" + encodeURIComponent("Failed to exchange code for token"), request.url),
      )
    }
  } catch (error) {
    console.error("Error in Fitbit callback route:", error)
    return NextResponse.redirect(
      new URL("/fitbit/error?error=" + encodeURIComponent("An unexpected error occurred"), request.url),
    )
  }
}
