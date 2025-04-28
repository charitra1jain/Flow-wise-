import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles, PlusCircle } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 dark:text-pink-400">
          Educational Content
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Choose your learning mode and explore our educational content
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Link href="/create-content?type=educational">
          <Button className="bg-gradient-to-r from-flowwise-burgundy to-flowwise-red hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Educational Content
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="adolescent" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="adolescent" className="text-base">
            <BookOpen className="mr-2 h-4 w-4" /> Adolescent Mode
          </TabsTrigger>
          <TabsTrigger value="adult" className="text-base">
            <Sparkles className="mr-2 h-4 w-4" /> Adult Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adolescent" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard
              title="What Are Periods?"
              description="Learn about menstruation through fun comics and simple explanations"
              link="/learn/adolescent/basics"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Your Changing Body"
              description="Understand the changes happening during puberty"
              link="/learn/adolescent/puberty"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Period Products"
              description="Explore different period products and how to use them"
              link="/learn/adolescent/products"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Common Myths"
              description="Debunking common myths about periods with fun facts"
              link="/learn/adolescent/myths"
              image="/placeholder.svg?height=200&width=300"
            />
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/learn/adolescent">
              <Button className="bg-pink-600 hover:bg-pink-700">
                View All Adolescent Content <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="adult" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard
              title="Menstrual Cycle Science"
              description="Detailed explanation of hormonal changes and the menstrual cycle"
              link="/learn/adult/science"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Menstrual Health Conditions"
              description="Understanding conditions like PCOS, endometriosis, and more"
              link="/learn/adult/conditions"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Sustainable Menstruation"
              description="Exploring eco-friendly period products and their benefits"
              link="/learn/adult/sustainable"
              image="/placeholder.svg?height=200&width=300"
            />
            <ContentCard
              title="Menstrual Health Research"
              description="Latest research and advancements in menstrual health"
              link="/learn/adult/research"
              image="/placeholder.svg?height=200&width=300"
            />
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/learn/adult">
              <Button className="bg-pink-600 hover:bg-pink-700">
                View All Adult Content <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContentCard({
  title,
  description,
  link,
  image,
}: {
  title: string
  description: string
  link: string
  image: string
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
      <CardContent>
        <Link href={link}>
          <Button variant="link" className="text-pink-600 dark:text-pink-400 p-0">
            Read more <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
