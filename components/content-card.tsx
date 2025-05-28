import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ContentCardProps {
  title: string
  description: string
  image: string
  link: string
}

export default function ContentCard({ title, description, image, link }: ContentCardProps) {
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
