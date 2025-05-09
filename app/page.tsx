import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageCircle, LineChart, Activity, ShoppingBag, BookOpen, CheckCircle } from "lucide-react"
import ModeSelector from "@/components/mode-selector"
import { SurveyHighlights } from "@/components/survey-highlights"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute blob-shape w-[600px] h-[600px] bg-flowwise-mint/30 dark:bg-flowwise-burgundy/20 -top-[300px] -left-[300px] animate-float"></div>
          <div className="absolute blob-shape-alt w-[500px] h-[500px] bg-flowwise-lightPink/20 dark:bg-flowwise-pink/10 -bottom-[250px] -right-[250px] animate-float [animation-delay:2s]"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="gradient-text">Menstrual Health</span> Education for Everyone
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Empowering all with knowledge, breaking taboos, and promoting menstrual wellness through education and
                community.
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Link href="/learn">
                <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="border-flowwise-pink hover:bg-flowwise-pink/10">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="w-full max-w-5xl mt-12 relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-flowwise-mint dark:bg-flowwise-burgundy/30 animate-pulse-gentle"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-flowwise-lightPink dark:bg-flowwise-pink/30 animate-pulse-gentle [animation-delay:1.5s]"></div>

              <Card className="overflow-hidden border-flowwise-lightPink/30 shadow-xl">
                <CardContent className="p-0">
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <img
                      src="/images/hero-image.jpeg"
                      alt="Power to the Period - Diverse hands holding period products"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the home page content remains the same */}
      {/* Mode Selection */}
      <section className="w-full py-16 bg-white dark:bg-background relative">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background to-transparent"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter gradient-text">Choose Your Learning Mode</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              We offer content tailored to different age groups and knowledge levels
            </p>
          </div>
          <ModeSelector />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-flowwise-mint/20 dark:bg-flowwise-burgundy/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter gradient-text">Our Features</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Comprehensive tools to support your menstrual health journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-flowwise-red" />}
              title="AI Chatbot"
              description="Get personalized answers to your menstrual health questions from our AI assistant"
              link="/chatbot"
              image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-flowwise-red" />}
              title="Symptom Tracker"
              description="Log your symptoms and receive personalized insights based on your data"
              link="/tracker"
              image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<Activity className="h-10 w-10 text-flowwise-red" />}
              title="Fitness Integrations"
              description="Connect with Google Fit, Apple Health, and more for holistic health tracking"
              link="/integrations"
              image="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1974&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-10 w-10 text-flowwise-red" />}
              title="Eco-Friendly Products"
              description="Discover sustainable menstrual products that are better for you and the planet"
              link="/products"
              image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-flowwise-red" />}
              title="Educational Content"
              description="Learn about menstrual health through engaging content tailored to your needs"
              link="/learn"
              image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-flowwise-red" />}
              title="Community Blog"
              description="Read and share experiences, bust myths, and learn from others' journeys"
              link="/blog"
              image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2032&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 bg-white dark:bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter gradient-text">What Our Users Say</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Hear from people who have transformed their relationship with menstrual health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="FlowWise has completely changed how I understand my body. The symptom tracker has helped me identify patterns I never noticed before."
              name="Sarah J."
              role="Student, 19"
              avatar="https://api.dicebear.com/7.x/micah/svg?seed=Sarah"
            />
            <TestimonialCard
              quote="As a parent, I was looking for resources to help educate my daughter. The adolescent mode is perfect - informative but age-appropriate and engaging."
              name="Michael T."
              role="Parent"
              avatar="https://api.dicebear.com/7.x/micah/svg?seed=Michael"
            />
            <TestimonialCard
              quote="The AI chatbot answered questions I was too embarrassed to ask anyone else. It's like having a knowledgeable friend available 24/7."
              name="Priya K."
              role="Professional, 28"
              avatar="https://api.dicebear.com/7.x/micah/svg?seed=Priya"
            />
          </div>
        </div>
      </section>

      {/* Add this in a suitable section of the home page */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Survey Insights</h2>
          <div className="max-w-3xl mx-auto">
            <SurveyHighlights />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-flowwise-burgundy to-flowwise-red">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-white max-w-lg">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to Transform Your Menstrual Health Journey?</h2>
              <p className="opacity-90">
                Join thousands of users who are taking control of their menstrual health with FlowWise.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-flowwise-mint" />
                  <span>Personalized education and insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-flowwise-mint" />
                  <span>Track symptoms and understand your body</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-flowwise-mint" />
                  <span>Connect with a supportive community</span>
                </li>
              </ul>
            </div>
            <div className="w-full max-w-md">
              <Card className="border-none shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-center text-flowwise-burgundy">
                    Create Your Free Account
                  </h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border border-flowwise-lightPink/50 rounded-md focus:outline-none focus:ring-2 focus:ring-flowwise-pink"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-2 border border-flowwise-lightPink/50 rounded-md focus:outline-none focus:ring-2 focus:ring-flowwise-pink"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-flowwise-lightPink/50 rounded-md focus:outline-none focus:ring-2 focus:ring-flowwise-pink"
                      />
                    </div>
                    <Link href="/signup" className="block w-full">
                      <Button className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                        Get Started
                      </Button>
                    </Link>
                    <p className="text-center text-xs text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <Link href="/terms" className="text-flowwise-red hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-flowwise-red hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
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
  image,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  image: string
}) {
  return (
    <Card className="overflow-hidden border-flowwise-lightPink/30 card-hover">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 rounded-full bg-flowwise-mint/30 dark:bg-flowwise-burgundy/20">{icon}</div>
          <h3 className="text-xl font-bold text-flowwise-burgundy dark:text-flowwise-pink">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link href={link}>
          <Button
            variant="link"
            className="text-flowwise-red hover:text-flowwise-burgundy dark:hover:text-flowwise-pink p-0"
          >
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string
  name: string
  role: string
  avatar: string
}) {
  return (
    <Card className="border-flowwise-lightPink/30 card-hover">
      <CardContent className="p-6">
        <div className="mb-4">
          <svg
            className="h-8 w-8 text-flowwise-pink opacity-50"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>
        <p className="text-muted-foreground mb-6">{quote}</p>
        <div className="flex items-center gap-3">
          <img src={avatar || "/placeholder.svg"} alt={name} className="h-10 w-10 rounded-full bg-flowwise-mint/30" />
          <div>
            <h4 className="font-medium text-flowwise-burgundy dark:text-flowwise-pink">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
