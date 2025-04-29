import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, ThumbsUp, Calendar, User, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          Community Blog
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Read and share experiences, bust myths, and learn about menstrual health
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Link href="/create-content">
          <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Blog Post
          </Button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="text-base">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="myths" className="text-base">
              Myth Busters
            </TabsTrigger>
            <TabsTrigger value="education" className="text-base">
              Educational
            </TabsTrigger>
            <TabsTrigger value="inclusivity" className="text-base">
              Inclusivity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogCard
                title="Debunking 5 Common Period Myths"
                description="Let's separate fact from fiction when it comes to menstruation"
                author="Dr. Sarah Johnson"
                date="Apr 15, 2023"
                image="/images/blogs/debunking-period-myths.png"
                category="myths"
                comments={24}
                likes={87}
                url="https://goauntflow.com/blog/debunking-5-common-period-myths/"
              />
              <BlogCard
                title="The History of the Tampon"
                description="A journey through time exploring the evolution of this essential menstrual product"
                author="Emily Parker"
                date="Mar 22, 2023"
                image="/images/blogs/history-of-tampon.png"
                category="education"
                comments={42}
                likes={156}
                url="https://goauntflow.com/blog/the-history-of-the-tampon/"
              />
              <BlogCard
                title="4 Stages of the Menstrual Cycle"
                description="A comprehensive guide to the four phases of your menstrual cycle"
                author="Dr. Michael Chen"
                date="Feb 10, 2023"
                image="/images/blogs/menstrual-cycle-stages.png"
                category="education"
                comments={18}
                likes={93}
                url="https://goauntflow.com/blog/4-stages-of-the-menstrual-cycle/"
              />
              <BlogCard
                title="What Causes a Period?"
                description="Understanding the biological processes behind menstruation"
                author="Dr. Lisa Rodriguez"
                date="Jan 28, 2023"
                image="/images/blogs/what-causes-period.jpeg"
                category="education"
                comments={36}
                likes={124}
                url="https://goauntflow.com/blog/what-causes-a-period/"
              />
              <BlogCard
                title="For Trans Awareness Week: Let's Talk About Period Inclusivity"
                description="Exploring how we can make period conversations and products more inclusive"
                author="Alex Thompson"
                date="Nov 15, 2022"
                image="/images/blogs/trans-awareness-week.png"
                category="inclusivity"
                comments={47}
                likes={203}
                url="https://goauntflow.com/blog/for-trans-awareness-week-lets-talk-about-period-inclusivity/"
              />
            </div>
          </TabsContent>

          <TabsContent value="myths" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogCard
                title="Debunking 5 Common Period Myths"
                description="Let's separate fact from fiction when it comes to menstruation"
                author="Dr. Sarah Johnson"
                date="Apr 15, 2023"
                image="/images/blogs/debunking-period-myths.png"
                category="myths"
                comments={24}
                likes={87}
                url="https://goauntflow.com/blog/debunking-5-common-period-myths/"
              />
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogCard
                title="The History of the Tampon"
                description="A journey through time exploring the evolution of this essential menstrual product"
                author="Emily Parker"
                date="Mar 22, 2023"
                image="/images/blogs/history-of-tampon.png"
                category="education"
                comments={42}
                likes={156}
                url="https://goauntflow.com/blog/the-history-of-the-tampon/"
              />
              <BlogCard
                title="4 Stages of the Menstrual Cycle"
                description="A comprehensive guide to the four phases of your menstrual cycle"
                author="Dr. Michael Chen"
                date="Feb 10, 2023"
                image="/images/blogs/menstrual-cycle-stages.png"
                category="education"
                comments={18}
                likes={93}
                url="https://goauntflow.com/blog/4-stages-of-the-menstrual-cycle/"
              />
              <BlogCard
                title="What Causes a Period?"
                description="Understanding the biological processes behind menstruation"
                author="Dr. Lisa Rodriguez"
                date="Jan 28, 2023"
                image="/images/blogs/what-causes-period.jpeg"
                category="education"
                comments={36}
                likes={124}
                url="https://goauntflow.com/blog/what-causes-a-period/"
              />
            </div>
          </TabsContent>

          <TabsContent value="inclusivity" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogCard
                title="For Trans Awareness Week: Let's Talk About Period Inclusivity"
                description="Exploring how we can make period conversations and products more inclusive"
                author="Alex Thompson"
                date="Nov 15, 2022"
                image="/images/blogs/trans-awareness-week.png"
                category="inclusivity"
                comments={47}
                likes={203}
                url="https://goauntflow.com/blog/for-trans-awareness-week-lets-talk-about-period-inclusivity/"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button className="bg-pink-600 hover:bg-pink-700">Load More Articles</Button>
        </div>

        <Card className="mt-16 border-pink-100 dark:border-pink-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Share Your Story
            </CardTitle>
            <CardDescription>Contribute to our community by sharing your experiences and knowledge</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We believe that sharing personal stories and knowledge helps break the stigma around menstruation and
              empowers others. Whether you want to share your journey, bust a myth, or educate others, we welcome your
              contribution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="border rounded-md p-4 text-center">
                <h3 className="font-medium mb-2">Personal Stories</h3>
                <p className="text-sm text-muted-foreground">
                  Share your experiences with menstruation, conditions, or products
                </p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <h3 className="font-medium mb-2">Myth Busters</h3>
                <p className="text-sm text-muted-foreground">
                  Help debunk common misconceptions about menstrual health
                </p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <h3 className="font-medium mb-2">Educational Content</h3>
                <p className="text-sm text-muted-foreground">
                  Contribute informative articles about menstrual health topics
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/create-content">
              <Button className="bg-pink-600 hover:bg-pink-700">Submit Your Story</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function BlogCard({
  title,
  description,
  author,
  date,
  image,
  category,
  comments,
  likes,
  url,
}: {
  title: string
  description: string
  author: string
  date: string
  image: string
  category: string
  comments: number
  likes: number
  url: string
}) {
  const categoryColors: Record<string, string> = {
    myths: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800",
    education:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800",
    inclusivity:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800",
  }

  return (
    <Card className="overflow-hidden border-pink-100 dark:border-pink-900/50 hover:shadow-md transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={categoryColors[category] || ""}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{author}</span>
          <span className="mx-1">•</span>
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="text-pink-600 dark:text-pink-400 p-0">
            Read More
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
