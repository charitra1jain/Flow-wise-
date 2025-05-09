"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ChatFeedbackProps {
  messageId: string
  onFeedbackSubmit: (messageId: string, rating: number, feedback?: string) => void
}

export function ChatFeedback({ messageId, onFeedbackSubmit }: ChatFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [showStars, setShowStars] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleThumbClick = (isUp: boolean) => {
    if (submitted) return
    setShowStars(true)
    setRating(isUp ? 4 : 2) // Default values for thumbs
  }

  const handleStarClick = (value: number) => {
    if (submitted) return
    setRating(value)

    // Submit feedback
    onFeedbackSubmit(messageId, value)
    setSubmitted(true)

    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve our AI assistant.",
      variant: "success",
    })
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <span>Thanks for your feedback!</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      {!showStars ? (
        <>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => handleThumbClick(true)}>
            <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground hover:text-green-500" />
            <span className="sr-only">Helpful</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => handleThumbClick(false)}
          >
            <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
            <span className="sr-only">Not helpful</span>
          </Button>
          <span className="text-xs text-muted-foreground">Was this helpful?</span>
        </>
      ) : (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleStarClick(value)}
            >
              <Star
                className={`h-4 w-4 ${
                  value <= (rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
              <span className="sr-only">{value} stars</span>
            </Button>
          ))}
          <span className="text-xs text-muted-foreground ml-1">Rate this response</span>
        </div>
      )}
    </div>
  )
}
