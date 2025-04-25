"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"

export default function ModeSelector() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card
        className={`cursor-pointer transition-all ${
          selectedMode === "adolescent"
            ? "border-pink-500 shadow-md"
            : "border-pink-100 dark:border-pink-900/50 hover:border-pink-300 dark:hover:border-pink-700"
        }`}
        onClick={() => setSelectedMode("adolescent")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pink-500" />
            <CardTitle>Adolescent Mode</CardTitle>
          </div>
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
            <Button
              className={`w-full ${
                selectedMode === "adolescent" ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500/80 hover:bg-pink-600"
              }`}
            >
              Enter Adolescent Mode <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card
        className={`cursor-pointer transition-all ${
          selectedMode === "adult"
            ? "border-pink-500 shadow-md"
            : "border-pink-100 dark:border-pink-900/50 hover:border-pink-300 dark:hover:border-pink-700"
        }`}
        onClick={() => setSelectedMode("adult")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <CardTitle>Adult Mode</CardTitle>
          </div>
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
            <Button
              className={`w-full ${
                selectedMode === "adult" ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500/80 hover:bg-pink-600"
              }`}
            >
              Enter Adult Mode <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
