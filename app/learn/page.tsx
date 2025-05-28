import type React from "react"
import Link from "next/link"

interface ContentCardProps {
  title: string
  description: string
  link: string
  image: string
}

const ContentCard: React.FC<ContentCardProps> = ({ title, description, link, image }) => {
  return (
    <Link href={link} className="block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

const LearnPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Learn</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Adolescent Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContentCard
            title="What Are Periods?"
            description="Learn about menstruation through fun comics and simple explanations"
            link="/learn/adolescent/basics"
            image="/images/what-is-menstruation-or-periods.jpg"
          />
          <ContentCard
            title="Your Changing Body"
            description="Understand the changes happening during puberty"
            link="/learn/adolescent/puberty"
            image="/images/changes in your body.jpg"
          />
          <ContentCard
            title="Period Products"
            description="Explore different period products and how to use them"
            link="/learn/adolescent/products"
            image="/images/period products.jpg"
          />
          <ContentCard
            title="Common Myths"
            description="Debunking common myths about periods with fun facts"
            link="/learn/adolescent/myths"
            image="/images/myths.jpg"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Adult Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContentCard
            title="Menstrual Health Conditions"
            description="Understanding conditions like PCOS, endometriosis, and more"
            link="/learn/adult/conditions"
            image="/images/conditions.jpg"
          />
        </div>
      </section>
    </div>
  )
}

export default LearnPage
