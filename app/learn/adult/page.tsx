import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText } from "lucide-react"
import Link from "next/link"
import ContentCard from "@/components/content-card"

export default function AdultModePage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-600 dark:text-pink-400">
          Adult Mode
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Comprehensive menstrual health education with scientific details and advanced topics
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            title="Menstrual Cycle Science"
            description="Detailed explanation of hormonal changes and the menstrual cycle"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/science"
          />
          <ContentCard
            title="Menstrual Health Conditions"
            description="Understanding conditions like PCOS, endometriosis, and more"
            image="/images/conditions.jpg"
            link="/learn/adult/conditions"
          />
          <ContentCard
            title="Sustainable Menstruation"
            description="Exploring eco-friendly period products and their benefits"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/sustainable"
          />
          <ContentCard
            title="Menstrual Health Research"
            description="Latest research and advancements in menstrual health"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/research"
          />
          <ContentCard
            title="Hormones & Health"
            description="How hormonal fluctuations affect overall health and wellbeing"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/hormones"
          />
          <ContentCard
            title="Nutrition & Exercise"
            description="Optimizing nutrition and exercise throughout your cycle"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/nutrition"
          />
          <ContentCard
            title="Mental Health"
            description="Understanding the connection between menstrual cycles and mental health"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/mental-health"
          />
          <ContentCard
            title="Fertility Awareness"
            description="Using cycle tracking for fertility awareness and contraception"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/fertility"
          />
          <ContentCard
            title="Menopause & Perimenopause"
            description="Understanding the transition and managing symptoms"
            image="/placeholder.svg?height=200&width=300"
            link="/learn/adult/menopause"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-pink-100 dark:border-pink-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Educational Series: "Cycle Science"
              </CardTitle>
              <CardDescription>In-depth educational content with scientific explanations and research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Episode 1: The Hormonal Orchestra</h3>
                  <p className="text-sm text-muted-foreground">
                    A deep dive into the complex hormonal interplay that regulates the menstrual cycle
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Episode 2: Beyond the Uterus</h3>
                  <p className="text-sm text-muted-foreground">
                    How hormonal fluctuations affect multiple body systems throughout the cycle
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Episode 3: The Microbiome Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Exploring the relationship between gut health, vaginal microbiome, and menstrual health
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/adult/series">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  View Full Series <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-pink-100 dark:border-pink-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Research & Resources
              </CardTitle>
              <CardDescription>Access scientific papers, research summaries, and expert resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Research Summaries</h3>
                  <p className="text-sm text-muted-foreground">
                    Digestible summaries of the latest scientific research on menstrual health
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Expert Interviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Conversations with gynecologists, endocrinologists, and researchers
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-1">Resource Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Downloadable guides, worksheets, and reference materials
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/adult/resources">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Access Resources <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
