"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Smartphone, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import FitbitIntegrationCard from "@/components/fitbit-integration-card"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function IntegrationsPage() {
  const { user } = useAuth()

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          Fitness App Integrations
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Connect FlowWise with your favorite fitness apps for comprehensive health tracking
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {!user && (
          <Alert className="mb-6 border-flowwise-lightPink bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 dark:border-flowwise-burgundy/30">
            <Info className="h-4 w-4 text-flowwise-burgundy dark:text-flowwise-pink" />
            <AlertTitle className="text-flowwise-burgundy dark:text-flowwise-pink">
              Sign in to connect integrations
            </AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Create an account or sign in to connect your fitness apps and get personalized insights.
              </p>
              <div className="flex gap-2 mt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-flowwise-pink hover:bg-flowwise-pink/10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90"
                  >
                    Create account
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FitbitIntegrationCard />
          <IntegrationCard
            title="Apple Health"
            description="Integrate with Apple Health to track your menstrual cycle alongside other health metrics"
            image="/placeholder.svg?height=100&width=100"
            status="Available"
          />
          <IntegrationCard
            title="Google Fit"
            description="Sync your menstrual data with Google Fit for a complete health overview"
            image="/placeholder.svg?height=100&width=100"
            status="Available"
          />
          <IntegrationCard
            title="Samsung Health"
            description="Sync your menstrual data with Samsung Health for comprehensive tracking"
            image="/placeholder.svg?height=100&width=100"
            status="Available"
          />
          <IntegrationCard
            title="Garmin Connect"
            description="Connect with Garmin to track your cycle alongside your fitness activities"
            image="/placeholder.svg?height=100&width=100"
            status="Coming Soon"
          />
          <IntegrationCard
            title="Strava"
            description="Integrate with Strava to understand how your cycle affects your performance"
            image="/placeholder.svg?height=100&width=100"
            status="Coming Soon"
          />
        </div>

        <Card className="border-pink-100 dark:border-pink-900/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Why Connect Your Fitness Apps?
            </CardTitle>
            <CardDescription>
              Understand the relationship between your menstrual cycle and overall health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comprehensive Health Tracking</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      See how your menstrual cycle affects your energy levels, sleep quality, and physical performance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Track how exercise impacts your menstrual symptoms
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Identify patterns between your cycle and other health metrics
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personalized Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Receive tailored workout recommendations based on your cycle phase
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Get nutrition tips optimized for different stages of your cycle
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Understand how to adjust your fitness routine to work with your body, not against it
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-100 dark:border-pink-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              How to Connect Your Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Sign in to your FlowWise account</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account or sign in to access integration features
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Click "Connect" on your preferred fitness app</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the fitness app you want to connect with FlowWise
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Authorize the Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow the prompts to authorize FlowWise to access your fitness data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Start Receiving Personalized Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Once connected, FlowWise will analyze your data and provide personalized recommendations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!user && (
              <Link href="/signup">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Create an Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function IntegrationCard({
  title,
  description,
  image,
  status,
}: {
  title: string
  description: string
  image: string
  status: "Connected" | "Available" | "Coming Soon"
}) {
  const statusColors: Record<string, string> = {
    Connected:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800",
    Available: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800",
    "Coming Soon":
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-800",
  }

  return (
    <Card className="border-pink-100 dark:border-pink-900/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md overflow-hidden">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline" className={statusColors[status] || ""}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-[60px]">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            status === "Connected"
              ? "bg-green-600 hover:bg-green-700"
              : status === "Available"
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          disabled={status === "Coming Soon"}
        >
          {status === "Connected" ? "Manage Connection" : status === "Available" ? "Connect" : "Coming Soon"}
        </Button>
      </CardFooter>
    </Card>
  )
}
