"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function FitbitErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Unknown error"

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Fitbit Connection Error</CardTitle>
          <CardDescription>There was a problem connecting to your Fitbit account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
          <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/integrations">Back to Integrations</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
