import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

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
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/basics"
          />
          <ContentCard
            title="Your Changing Body"
            description="Understand the changes happening during puberty"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/puberty"
          />
          <ContentCard
            title="Period Products"
            description="Explore different period products and how to use them"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adolescent/products"
          />
          <ContentCard
            title="Common Myths"
            description="Debunking common myths about periods with fun facts"
            image="/placeholder.svg?height=200&width=300"
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
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2">
                    <p className="text-muted-foreground">Comic preview</p>
                  </div>
                  <h3 className="font-medium">Episode 1: Maya's First Period</h3>
                </div>
                <div className="border rounded-md p-4">
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2">
                    <p className="text-muted-foreground">Comic preview</p>
                  </div>
                  <h3 className="font-medium">Episode 2: Shopping for Supplies</h3>
                </div>
                <div className="border rounded-md p-4">
                  <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center mb-2">
                    <p className="text-muted-foreground">Comic preview</p>
                  </div>
                  <h3 className="font-medium">Episode 3: Gym Class Worries</h3>
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

function ContentCard({
  title,
  description,
  image,
  link,
}: {
  title: string
  description: string
  image: string
  link: string
}) {
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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={link} className="w-full">
          <Button className="w-full bg-pink-600 hover:bg-pink-700">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
