/**
 * Fitbit Integration Service
 * Handles OAuth flow and API calls to Fitbit Web API
 */

// OAuth 2.0 Configuration
// Fix the redirect URI to handle both client and server environments
const FITBIT_REDIRECT_URI = process.env.NEXT_PUBLIC_FITBIT_REDIRECT_URI || "http://localhost:3000/fitbit/callback"

// Also fix the client ID and secret to use environment variables
const FITBIT_CLIENT_ID = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID || "23Q8CR"
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET || "eb5b81aa8bdfd36768d39c1353d4bedf"
const FITBIT_AUTH_URL = "https://www.fitbit.com/oauth2/authorize"
const FITBIT_TOKEN_URL = "https://api.fitbit.com/oauth2/token"
const FITBIT_API_BASE_URL = "https://api.fitbit.com"

// Scopes needed for the application
// Reference: https://dev.fitbit.com/build/reference/web-api/oauth2/#scope
const FITBIT_SCOPES = [
  "activity",
  "heartrate",
  "location",
  "nutrition",
  "profile",
  "settings",
  "sleep",
  "social",
  "weight",
]

// Types for Fitbit data
export interface FitbitTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: number
  scope: string
  token_type: string
  user_id: string
}

export interface FitbitProfile {
  user: {
    id: string
    displayName: string
    firstName: string
    lastName: string
    gender: string
    avatar: string
    avatar150: string
    dateOfBirth: string
  }
}

export interface FitbitActivitySummary {
  activeScore: number
  activityCalories: number
  caloriesBMR: number
  caloriesOut: number
  distances: Array<{
    activity: string
    distance: number
  }>
  fairlyActiveMinutes: number
  lightlyActiveMinutes: number
  marginalCalories: number
  sedentaryMinutes: number
  steps: number
  veryActiveMinutes: number
}

export interface FitbitSleepSummary {
  totalMinutesAsleep: number
  totalSleepRecords: number
  totalTimeInBed: number
}

export interface FitbitHeartRateSummary {
  restingHeartRate: number
  heartRateZones: Array<{
    caloriesOut: number
    max: number
    min: number
    minutes: number
    name: string
  }>
}

// Generate the authorization URL for Fitbit OAuth
// Updated to be more robust with error handling
export const getFitbitAuthUrl = (state: string): string => {
  if (!state) {
    throw new Error("State parameter is required for CSRF protection")
  }

  // Validate required configuration
  if (!FITBIT_CLIENT_ID) {
    throw new Error("Fitbit Client ID is not configured")
  }

  if (!FITBIT_REDIRECT_URI) {
    throw new Error("Fitbit Redirect URI is not configured")
  }

  try {
    const params = new URLSearchParams({
      client_id: FITBIT_CLIENT_ID,
      response_type: "code",
      scope: FITBIT_SCOPES.join(" "),
      redirect_uri: FITBIT_REDIRECT_URI,
      state,
    })

    return `${FITBIT_AUTH_URL}?${params.toString()}`
  } catch (error) {
    console.error("Error generating Fitbit auth URL:", error)
    throw new Error(
      `Failed to generate Fitbit authorization URL: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string): Promise<FitbitTokens> => {
  const basicAuth = Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(FITBIT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: FITBIT_REDIRECT_URI,
    }).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for token: ${error}`)
  }

  const data = await response.json()

  // Add expires_at to help with token refresh
  const expiresAt = Date.now() + data.expires_in * 1000

  return {
    ...data,
    expires_at: expiresAt,
  }
}

// Refresh access token when it expires
export const refreshAccessToken = async (refreshToken: string): Promise<FitbitTokens> => {
  const basicAuth = Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString("base64")

  const response = await fetch(FITBIT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  const data = await response.json()

  // Add expires_at to help with token refresh
  const expiresAt = Date.now() + data.expires_in * 1000

  return {
    ...data,
    expires_at: expiresAt,
  }
}

// Make authenticated API requests to Fitbit
// Completely rewritten with standard function signature
export async function fetchFromFitbit<T>(
  endpoint: string,
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
): Promise<T> {
  // Check if token is expired and refresh if needed
  let currentTokens = { ...tokens }

  if (currentTokens.expires_at < Date.now() && refreshTokenCallback) {
    try {
      currentTokens = await refreshAccessToken(currentTokens.refresh_token)
      await refreshTokenCallback(currentTokens)
    } catch (error) {
      console.error("Error refreshing token:", error)
      throw new Error("Your Fitbit authorization has expired. Please reconnect your account.")
    }
  }

  const response = await fetch(`${FITBIT_API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${currentTokens.access_token}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Fitbit API error: ${error}`)
  }

  return response.json()
}

// Get user profile
export const getFitbitProfile = async (
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
): Promise<FitbitProfile> => {
  return fetchFromFitbit<FitbitProfile>("/1/user/-/profile.json", tokens, refreshTokenCallback)
}

// Get activity summary for a specific date
export const getActivitySummary = async (
  date: string, // Format: YYYY-MM-DD
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
): Promise<{ activities: FitbitActivitySummary }> => {
  return fetchFromFitbit<{ activities: FitbitActivitySummary }>(
    `/1/user/-/activities/date/${date}.json`,
    tokens,
    refreshTokenCallback,
  )
}

// Get sleep summary for a specific date
export const getSleepSummary = async (
  date: string, // Format: YYYY-MM-DD
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
): Promise<{ sleep: FitbitSleepSummary }> => {
  return fetchFromFitbit<{ sleep: FitbitSleepSummary }>(
    `/1.2/user/-/sleep/date/${date}.json`,
    tokens,
    refreshTokenCallback,
  )
}

// Get heart rate summary for a specific date
export const getHeartRateSummary = async (
  date: string, // Format: YYYY-MM-DD
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
): Promise<{ activities: { heart: FitbitHeartRateSummary } }> => {
  return fetchFromFitbit<{ activities: { heart: FitbitHeartRateSummary } }>(
    `/1/user/-/activities/heart/date/${date}/1d.json`,
    tokens,
    refreshTokenCallback,
  )
}

// Get all health data for a specific date
export const getDailyHealthData = async (
  date: string, // Format: YYYY-MM-DD
  tokens: FitbitTokens,
  refreshTokenCallback?: (newTokens: FitbitTokens) => Promise<void>,
) => {
  try {
    const [activity, sleep, heart] = await Promise.all([
      getActivitySummary(date, tokens, refreshTokenCallback),
      getSleepSummary(date, tokens, refreshTokenCallback),
      getHeartRateSummary(date, tokens, refreshTokenCallback),
    ])

    return {
      activity: activity.activities,
      sleep: sleep.sleep,
      heart: heart.activities.heart,
      date,
    }
  } catch (error) {
    console.error("Error fetching daily health data:", error)
    throw error
  }
}
