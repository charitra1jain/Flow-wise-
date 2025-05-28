import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, MessageCircle, Users, Sparkles, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="container px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800 animate-pulse-gentle"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Empowering Menstrual Health
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Your Journey to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 animate-gradient">
                    Menstrual Wellness
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Comprehensive education, personalized tracking, and supportive community for every stage of your
                  menstrual health journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/learn">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tracker">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-300 dark:hover:bg-pink-900/20 transform hover:scale-105 transition-all duration-200"
                  >
                    Track Symptoms
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse-gentle"></div>
              <img
                src="/images/hero-main.png"
                alt="FlowWise - Menstrual Health Education"
                className="relative w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Staggered Animation */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Menstrual Health
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From education to tracking, we provide comprehensive tools to support your menstrual health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Educational Content",
                description: "Age-appropriate learning materials from adolescent basics to advanced adult topics",
                color: "pink",
                delay: "0ms",
              },
              {
                icon: Calendar,
                title: "Symptom Tracking",
                description: "Track your cycle, symptoms, and mood with personalized insights and predictions",
                color: "purple",
                delay: "100ms",
              },
              {
                icon: MessageCircle,
                title: "AI Chatbot",
                description: "Get instant answers to your menstrual health questions from our AI assistant",
                color: "blue",
                delay: "200ms",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with others and share experiences in a safe, supportive environment",
                color: "green",
                delay: "300ms",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data is secure and private. We never share your personal information",
                color: "indigo",
                delay: "400ms",
              },
              {
                icon: Zap,
                title: "Smart Insights",
                description: "Get personalized recommendations based on your tracking data and patterns",
                color: "orange",
                delay: "500ms",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-gray-100 dark:border-gray-800 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Take Control of Your Menstrual Health?
            </h2>
            <p className="text-xl text-pink-100">
              Join thousands of users who have already started their journey to better menstrual health understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-pink-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-pink-600 transform hover:scale-105 transition-all duration-200"
                >
                  Explore Content
                  <BookOpen className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
