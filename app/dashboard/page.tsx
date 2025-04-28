"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LineChart, CalendarDays, Settings, MessageCircle, BookOpen, Activity } from "lucide-react"
import Link from "next/link"
// Make sure FitbitDashboard is properly imported
import FitbitDashboard from "@/components/fitbit-dashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-flowwise-pink border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-flowwise-lightPink">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-flowwise-pink text-white text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome, {user.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground">Your personal menstrual health dashboard</p>
          </div>
        </div>
        <Button variant="outline" className="border-flowwise-pink hover:bg-flowwise-pink/10">
          <Settings className="mr-2 h-4 w-4" /> Account Settings
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="text-base">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tracker" className="text-base">
            Cycle Tracker
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-base">
            Insights
          </TabsTrigger>
          <TabsTrigger value="learning" className="text-base">
            Learning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-flowwise-lightPink/30 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  Cycle Status
                </CardTitle>
                <CardDescription>Your current cycle information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current cycle day:</span>
                    <span className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">Day 14</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next period in:</span>
                    <span className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">14 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cycle phase:</span>
                    <span className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">Ovulation</span>
                  </div>
                  <div className="w-full bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 h-2 rounded-full mt-4">
                    <div
                      className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red h-2 rounded-full"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                  <Link href="/tracker">
                    <Button variant="link" className="p-0 text-flowwise-red hover:text-flowwise-burgundy">
                      View detailed tracker
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-flowwise-lightPink/30 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  Recent Symptoms
                </CardTitle>
                <CardDescription>Your logged symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-flowwise-lightPink/20">
                    <span className="text-muted-foreground">Headache</span>
                    <span className="text-sm">2 days ago</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-flowwise-lightPink/20">
                    <span className="text-muted-foreground">Bloating</span>
                    <span className="text-sm">3 days ago</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-flowwise-lightPink/20">
                    <span className="text-muted-foreground">Fatigue</span>
                    <span className="text-sm">3 days ago</span>
                  </div>
                  <Link href="/tracker">
                    <Button variant="link" className="p-0 text-flowwise-red hover:text-flowwise-burgundy">
                      Log new symptoms
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-flowwise-lightPink/30 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get personalized help</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ask our AI assistant any questions about menstrual health or get personalized recommendations.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm p-2 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 rounded-lg">
                      How can I manage menstrual cramps?
                    </div>
                    <div className="text-sm p-2 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 rounded-lg">
                      What foods help with bloating?
                    </div>
                  </div>
                  <Link href="/chatbot">
                    <Button className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                      Chat with AI Assistant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fitbit Dashboard */}
          <FitbitDashboard />

          <Card className="border-flowwise-lightPink/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                Cycle History
              </CardTitle>
              <CardDescription>Your menstrual cycle patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-flowwise-mint/10 dark:bg-flowwise-burgundy/5 rounded-md">
                <p className="text-muted-foreground">Cycle visualization chart would appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-flowwise-lightPink/30 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  Recommended Learning
                </CardTitle>
                <CardDescription>Content tailored for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-12 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-flowwise-burgundy dark:text-flowwise-pink" />
                    </div>
                    <div>
                      <h4 className="font-medium">Understanding Ovulation</h4>
                      <p className="text-xs text-muted-foreground">5 min read</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-12 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10 rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-flowwise-burgundy dark:text-flowwise-pink" />
                    </div>
                    <div>
                      <h4 className="font-medium">Nutrition for Your Cycle</h4>
                      <p className="text-xs text-muted-foreground">8 min read</p>
                    </div>
                  </div>
                  <Link href="/learn">
                    <Button variant="link" className="p-0 text-flowwise-red hover:text-flowwise-burgundy">
                      View all learning content
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-flowwise-lightPink/30 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/tracker">
                    <Button
                      variant="outline"
                      className="w-full border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
                    >
                      <Activity className="mr-2 h-4 w-4" /> Log Symptoms
                    </Button>
                  </Link>
                  <Link href="/chatbot">
                    <Button
                      variant="outline"
                      className="w-full border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" /> Ask AI
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" /> Shop Products
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button
                      variant="outline"
                      className="w-full border-flowwise-lightPink/50 hover:bg-flowwise-pink/10 justify-start"
                    >
                      <BookOpen className="mr-2 h-4 w-4" /> Learn
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-8">
          <Card className="border-flowwise-lightPink/30">
            <CardHeader>
              <CardTitle>Cycle Tracker</CardTitle>
              <CardDescription>Track and visualize your menstrual cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  The full tracker functionality would be implemented here. For now, you can visit the tracker page.
                </p>
                <Link href="/tracker">
                  <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                    Go to Tracker
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          <Card className="border-flowwise-lightPink/30">
            <CardHeader>
              <CardTitle>Personalized Insights</CardTitle>
              <CardDescription>Data-driven insights about your menstrual health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Personalized insights based on your tracking data would appear here as you log more information.
                </p>
                <Link href="/tracker">
                  <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                    Start Tracking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-8">
          <Card className="border-flowwise-lightPink/30">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your educational journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Your learning progress and recommended content would appear here.
                </p>
                <Link href="/learn">
                  <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                    Explore Learning Content
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
