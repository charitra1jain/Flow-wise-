import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import ContentCard from "@/components/content-card"

export default function AdolescentModePage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 dark:text-pink-400">
          Adolescent Mode
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Learn about menstrual health in a fun, easy-to-understand way
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            title="What Are Periods?"
            description="Learn about menstruation through fun comics and simple explanations"
            image="/images/what-is-menstruation-or-periods.jpg"
            link="/learn/adolescent/basics"
          />
          <ContentCard
            title="Your Changing Body"
            description="Understand the changes happening during puberty"
            image="/images/changes in your body.jpg"
            link="/learn/adolescent/puberty"
          />
          <ContentCard
            title="Period Products"
            description="Explore different period products and how to use them"
            image="/images/period products.jpg"
            link="/learn/adolescent/products"
          />
          <ContentCard
            title="Common Myths"
            description="Debunking common myths about periods with fun facts"
            image="/images/myths.jpg"
            link="/learn/adolescent/myths"
          />
          <ContentCard
            title="Period Calendar"
            description="Learn how to track your period and understand your cycle"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/calendar"
          />
          <ContentCard
            title="Taking Care of Yourself"
            description="Self-care tips for when you're on your period"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/self-care"
          />
          <ContentCard
            title="Talking About Periods"
            description="How to have conversations about periods with friends and family"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/talking"
          />
          <ContentCard
            title="Period Problems"
            description="Common issues and when to talk to a doctor"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/problems"
          />
          <ContentCard
            title="Fun Activities"
            description="Interactive games and quizzes about menstrual health"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/activities"
          />
        </div>

        <div className="mt-16">
          <Card className="border-pink-100 dark:border-pink-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Comic Series: "The Period Pals"
              </CardTitle>
              <CardDescription>
                Follow Maya and her friends as they navigate puberty and learn about periods together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src="/images/comics/comic-1.jpeg"
                      alt="Comic: How Babies Are Made"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Episode 1: Understanding Reproduction</h3>
                </div>
                <div className="border rounded-md p-4">
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src="/images/comics/comic-2.jpeg"
                      alt="Comic: Puberty and Growth"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Episode 2: Growing Up and Hormones</h3>
                </div>
                <div className="border rounded-md p-4">
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src="/images/comics/comic-3.jpeg"
                      alt="Comic: First Period Experience"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">Episode 3: My First Period</h3>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/adolescent/comics">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Read All Comics <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
