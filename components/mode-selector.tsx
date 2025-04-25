"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"

export default function ModeSelector() {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="adolescent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="adolescent" className="text-base py-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-flowwise-burgundy/10 to-flowwise-red/10 transform origin-left transition-transform duration-300 scale-x-0 group-data-[state=active]:scale-x-100"></div>
            <div className="relative flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              <span>Adolescent Mode</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="adult" className="text-base py-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-flowwise-pink/10 to-flowwise-lightPink/10 transform origin-left transition-transform duration-300 scale-x-0 group-data-[state=active]:scale-x-100"></div>
            <div className="relative flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-flowwise-burgundy dark:text-flowwise-pink" />
              <span>Adult Mode</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adolescent" className="space-y-4 animate-in fade-in-50 duration-300">
          <Card className="overflow-hidden border-flowwise-lightPink/30 card-hover">
            <div className="h-40 bg-gradient-to-br from-flowwise-burgundy to-flowwise-red relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=2070&auto=format&fit=crop"
                  alt="Teenagers learning together"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-flowwise-burgundy dark:text-flowwise-pink">Adolescent Mode</CardTitle>
              <CardDescription>For teenagers and beginners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Learn about menstrual health with:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Comic strips and illustrations</li>
                  <li>Simple, easy-to-understand language</li>
                  <li>Interactive activities</li>
                  <li>Beginner-friendly content</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/adolescent" className="w-full">
                <Button className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
                  Enter Adolescent Mode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="adult" className="space-y-4 animate-in fade-in-50 duration-300">
          <Card className="overflow-hidden border-flowwise-lightPink/30 card-hover">
            <div className="h-40 bg-gradient-to-br from-flowwise-pink to-flowwise-lightPink relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop"
                  alt="Adult learning"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-flowwise-burgundy dark:text-flowwise-pink">Adult Mode</CardTitle>
              <CardDescription>For adults and advanced learners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Explore menstrual health with:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Detailed scientific explanations</li>
                  <li>Advanced terminology</li>
                  <li>Educational memes and humor</li>
                  <li>In-depth research and resources</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/adult" className="w-full">
                <Button className="w-full bg-gradient-to-r from-flowwise-pink to-flowwise-lightPink hover:opacity-90 transition-opacity">
                  Enter Adult Mode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
