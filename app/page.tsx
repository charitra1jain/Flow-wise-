import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MessageCircle, LineChart, Activity, ShoppingBag, BookOpen } from "lucide-react"
import ModeSelector from "@/components/mode-selector"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-pink-600 dark:text-pink-400">
                Welcome to FlowWise
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Empowering everyone with knowledge about menstrual health and wellness
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/learn">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="w-full py-12 bg-white dark:bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-pink-600 dark:text-pink-400">
              Choose Your Learning Mode
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400">
              We offer content tailored to different age groups and knowledge levels
            </p>
          </div>
          <ModeSelector />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 bg-pink-50 dark:bg-pink-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-pink-600 dark:text-pink-400">Our Features</h2>
            <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400">
              Comprehensive tools to support your menstrual health journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-pink-500" />}
              title="AI Chatbot"
              description="Get personalized answers to your menstrual health questions"
              link="/chatbot"
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-pink-500" />}
              title="Symptom Tracker"
              description="Log your symptoms and receive personalized insights"
              link="/tracker"
            />
            <FeatureCard
              icon={<Activity className="h-10 w-10 text-pink-500" />}
              title="Fitness Integrations"
              description="Connect with Google Fit, Apple Fitness, and more"
              link="/integrations"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-10 w-10 text-pink-500" />}
              title="Eco-Friendly Products"
              description="Discover sustainable menstrual products"
              link="/products"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-pink-500" />}
              title="Educational Content"
              description="Learn about menstrual health through engaging content"
              link="/learn"
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-pink-500" />}
              title="Community Blog"
              description="Read and share experiences, bust myths together"
              link="/blog"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <Card className="border-pink-100 dark:border-pink-900/50 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <div className="mt-4">
          <Link href={link}>
            <Button variant="link" className="text-pink-600 dark:text-pink-400 p-0">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
