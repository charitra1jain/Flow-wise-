"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function CreateContentPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "blog"
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, router, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !content || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Content created",
        description: "Your content has been published successfully",
        variant: "success",
      })

      // Redirect based on content type
      if (type === "blog") {
        router.push("/blog")
      } else if (type === "educational") {
        router.push("/learn")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: "There was a problem creating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFormTitle = () => {
    switch (type) {
      case "blog":
        return "Create Blog Post"
      case "educational":
        return "Create Educational Content"
      default:
        return "Create Content"
    }
  }

  const getCategoryOptions = () => {
    if (type === "blog") {
      return [
        { value: "myths", label: "Myth Busters" },
        { value: "stories", label: "Personal Stories" },
        { value: "education", label: "Educational" },
      ]
    } else if (type === "educational") {
      return [
        { value: "adolescent", label: "Adolescent Mode" },
        { value: "adult", label: "Adult Mode" },
      ]
    }
    return []
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          {getFormTitle()}
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Share your knowledge and experiences with the FlowWise community
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-pink-100 dark:border-pink-900/50">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>Fill in the details for your {type} post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="border-flowwise-lightPink/50 focus-visible:ring-flowwise-pink"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="border-flowwise-lightPink/50 focus-visible:ring-flowwise-pink">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategoryOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload value={image} onChange={setImage} className="h-[200px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content here..."
                  className="min-h-[300px] border-flowwise-lightPink/50 focus-visible:ring-flowwise-pink"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Content"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
