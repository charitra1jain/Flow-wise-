import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Leaf, Recycle, Heart, MapPin } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          Eco-Friendly Products
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Discover sustainable menstrual products that are better for you and the planet
        </p>
      </div>

      <Tabs defaultValue="all" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all" className="text-base">
            All Products
          </TabsTrigger>
          <TabsTrigger value="reusable" className="text-base">
            Reusable
          </TabsTrigger>
          <TabsTrigger value="disposable" className="text-base">
            Eco-Disposable
          </TabsTrigger>
          <TabsTrigger value="vending" className="text-base">
            Vending Machines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              title="Bamboo Pads"
              description="Biodegradable pads made from sustainable bamboo fibers"
              price="$12.99"
              image="/images/products/bamboo-pads.jpg"
              badges={["Eco-Friendly", "Biodegradable"]}
              category="disposable"
            />
            <ProductCard
              title="Menstrual Cup"
              description="Reusable silicone cup that can last up to 10 years"
              price="$29.99"
              image="/images/products/menstrual-cup.jpg"
              badges={["Reusable", "Zero Waste"]}
              category="reusable"
            />
            <ProductCard
              title="Period Underwear"
              description="Absorbent, leak-proof underwear for period protection"
              price="$34.99"
              image="/placeholder.svg?height=200&width=300"
              badges={["Reusable", "Comfortable"]}
              category="reusable"
            />
            <ProductCard
              title="Organic Cotton Tampons"
              description="100% organic cotton tampons without harmful chemicals"
              price="$8.99"
              image="/placeholder.svg?height=200&width=300"
              badges={["Organic", "Chemical-Free"]}
              category="disposable"
            />
            <ProductCard
              title="Reusable Cloth Pads"
              description="Washable cloth pads made from organic cotton"
              price="$18.99"
              image="/images/products/cloth-pads.jpg"
              badges={["Reusable", "Organic"]}
              category="reusable"
            />
            <ProductCard
              title="Vending Machine Locator"
              description="Find FlowWise vending machines with eco-friendly products near you"
              price="Free"
              image="/images/products/vending-machine.jpg"
              badges={["Service", "Accessibility"]}
              category="vending"
              isService={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="reusable" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              title="Menstrual Cup"
              description="Reusable silicone cup that can last up to 10 years"
              price="$29.99"
              image="/images/products/menstrual-cup.jpg"
              badges={["Reusable", "Zero Waste"]}
              category="reusable"
            />
            <ProductCard
              title="Period Underwear"
              description="Absorbent, leak-proof underwear for period protection"
              price="$34.99"
              image="/placeholder.svg?height=200&width=300"
              badges={["Reusable", "Comfortable"]}
              category="reusable"
            />
            <ProductCard
              title="Reusable Cloth Pads"
              description="Washable cloth pads made from organic cotton"
              price="$18.99"
              image="/images/products/cloth-pads.jpg"
              badges={["Reusable", "Organic"]}
              category="reusable"
            />
          </div>
        </TabsContent>

        <TabsContent value="disposable" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              title="Bamboo Pads"
              description="Biodegradable pads made from sustainable bamboo fibers"
              price="$12.99"
              image="/images/products/bamboo-pads.jpg"
              badges={["Eco-Friendly", "Biodegradable"]}
              category="disposable"
            />
            <ProductCard
              title="Organic Cotton Tampons"
              description="100% organic cotton tampons without harmful chemicals"
              price="$8.99"
              image="/placeholder.svg?height=200&width=300"
              badges={["Organic", "Chemical-Free"]}
              category="disposable"
            />
          </div>
        </TabsContent>

        <TabsContent value="vending" className="space-y-8">
          <Card className="border-pink-100 dark:border-pink-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                FlowWise Vending Machines
              </CardTitle>
              <CardDescription>
                Find eco-friendly menstrual products in vending machines at convenient locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-md flex items-center justify-center mb-6 overflow-hidden">
                <img
                  src="/images/products/vending-machine.jpg"
                  alt="FlowWise Vending Machine"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">About Our Vending Machines</h3>
                <p className="text-sm text-muted-foreground">
                  FlowWise vending machines provide access to eco-friendly menstrual products in public spaces, schools,
                  workplaces, and more. Our machines offer a variety of sustainable options, including:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Bamboo pads</li>
                  <li>Organic cotton tampons</li>
                  <li>Menstrual cups</li>
                  <li>Period underwear</li>
                  <li>Pain relief products</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <MapPin className="mr-2 h-4 w-4" />
                Find Nearest Vending Machine
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="max-w-5xl mx-auto mt-16">
        <Card className="border-pink-100 dark:border-pink-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Why Choose Eco-Friendly Products?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <Leaf className="h-12 w-12 text-pink-600 dark:text-pink-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Better for the Planet</h3>
                <p className="text-sm text-muted-foreground">
                  Conventional menstrual products contribute to plastic pollution. Eco-friendly alternatives reduce
                  waste and environmental impact.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Heart className="h-12 w-12 text-pink-600 dark:text-pink-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Better for Your Health</h3>
                <p className="text-sm text-muted-foreground">
                  Many eco-friendly products are free from harmful chemicals, bleaches, and synthetic materials found in
                  conventional products.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <Recycle className="h-12 w-12 text-pink-600 dark:text-pink-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Cost-Effective Long Term</h3>
                <p className="text-sm text-muted-foreground">
                  While some eco-friendly products have a higher upfront cost, they save money in the long run as
                  reusable options can last for years.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProductCard({
  title,
  description,
  price,
  image,
  badges,
  category,
  isService = false,
}: {
  title: string
  description: string
  price: string
  image: string
  badges: string[]
  category: string
  isService?: boolean
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
        <div className="flex justify-between items-start">
          <CardTitle>{title}</CardTitle>
          <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{price}</div>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {badges.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-300 dark:border-pink-800"
            >
              {badge}
            </Badge>
          ))}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full bg-pink-600 hover:bg-pink-700">
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isService ? "Find Locations" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
