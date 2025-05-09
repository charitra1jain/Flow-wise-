"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchSurveyData, countResponses, getMultiSelectCounts, type SurveyResponse } from "@/lib/survey-data"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { Loader2, Filter, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export default function DataPage() {
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>([])
  const [filteredData, setFilteredData] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [ageFilter, setAgeFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    async function loadData() {
      const data = await fetchSurveyData()
      setSurveyData(data)
      setFilteredData(data)
      setLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...surveyData]

    // Apply age filter
    if (ageFilter !== "all") {
      filtered = filtered.filter((item) => item.Age === ageFilter)
      if (!activeFilters.includes(`Age: ${ageFilter}`)) {
        setActiveFilters((prev) => [...prev, `Age: ${ageFilter}`])
      }
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith("Age:")))
    }

    // Apply product filter
    if (productFilter.length > 0) {
      filtered = filtered.filter((item) => productFilter.includes(item.ProductType))

      // Update active filters for products
      const productFilterLabels = productFilter.map((p) => `Product: ${p}`)
      setActiveFilters((prev) => {
        const withoutProducts = prev.filter((f) => !f.startsWith("Product:"))
        return [...withoutProducts, ...productFilterLabels]
      })
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith("Product:")))
    }

    setFilteredData(filtered)
  }, [ageFilter, productFilter, surveyData])

  const clearFilters = () => {
    setAgeFilter("all")
    setProductFilter([])
    setActiveFilters([])
    setFilteredData(surveyData)
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Age:")) {
      setAgeFilter("all")
    } else if (filter.startsWith("Product:")) {
      const product = filter.replace("Product: ", "")
      setProductFilter((prev) => prev.filter((p) => p !== product))
    }
  }

  const toggleProductFilter = (product: string) => {
    setProductFilter((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]))
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-flowwise-burgundy" />
          <p className="text-lg font-medium">Loading survey data...</p>
        </div>
      </div>
    )
  }

  // Get unique product types and age groups for filters
  const productTypes = Array.from(new Set(surveyData.map((item) => item.ProductType).filter(Boolean)))
  const ageGroups = Array.from(new Set(surveyData.map((item) => item.Age).filter(Boolean)))

  // Prepare data for charts
  const productTypeCounts = countResponses(filteredData, "ProductType")
  const productTypeData = Object.entries(productTypeCounts).map(([name, value]) => ({
    name,
    value,
  }))

  const willingnessToShift = countResponses(filteredData, "WillingToShift")
  const willingnessData = Object.entries(willingnessToShift).map(([name, value]) => ({
    name,
    value,
  }))

  const awarenessOfHarm = countResponses(filteredData, "AwarenessOfHarm")
  const awarenessData = Object.entries(awarenessOfHarm).map(([name, value]) => ({
    name,
    value,
  }))

  const physiologicalIssues = getMultiSelectCounts(filteredData, "PhysiologicalIssues")
  const issuesData = Object.entries(physiologicalIssues)
    .filter(([name]) => name !== "No issues")
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      fullName: name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 issues

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926", "#1982C4"]

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-pink-600 dark:text-pink-400">
          Menstrual Hygiene Survey Data
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Insights from our survey on menstrual hygiene product choices and practices
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Filter className="h-5 w-5" /> Data Filters
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters} disabled={activeFilters.length === 0}>
              Clear All Filters
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Info className="h-4 w-4" /> Help
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium">How to use filters</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the filters to narrow down the survey data by age group or product type. You can select multiple
                    product types. All charts will update automatically based on your filter selections.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age-filter" className="mb-2 block">
              Age Group
            </Label>
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger id="age-filter">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Age Groups</SelectItem>
                {ageGroups
                  .filter((age) => age && age.trim() !== "") // Filter out empty, null or undefined values
                  .map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label className="mb-2 block">Product Type</Label>
            <div className="flex flex-wrap gap-2">
              {productTypes.map((product) => (
                <div key={product} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product}`}
                    checked={productFilter.includes(product)}
                    onCheckedChange={() => toggleProductFilter(product)}
                  />
                  <label
                    htmlFor={`product-${product}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {product}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4">
            <Label className="mb-2 block">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="text-base">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="text-base">
              Product Choices
            </TabsTrigger>
            <TabsTrigger value="health" className="text-base">
              Health & Awareness
            </TabsTrigger>
            <TabsTrigger value="practices" className="text-base">
              Hygiene Practices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Survey Participants</CardTitle>
                  <CardDescription>
                    Total responses: {filteredData.length}
                    {filteredData.length !== surveyData.length && ` (filtered from ${surveyData.length})`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Distribution of menstrual hygiene products used by respondents
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Willingness to Shift to Eco-friendly Products</CardTitle>
                  <CardDescription>Respondents' openness to biodegradable alternatives</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={willingnessData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {willingnessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Willingness to shift to biodegradable pads or cloth pads
                  </p>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Common Physiological Issues During Periods</CardTitle>
                  <CardDescription>Reported symptoms and challenges</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={issuesData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value, name, props) => [`${value} responses`, props.payload.fullName]} />
                      <Legend />
                      <Bar dataKey="value" fill="#FF6384" name="Number of Respondents" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Most commonly reported physiological and psychological issues during menstruation
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Types Used</CardTitle>
                  <CardDescription>Current menstrual hygiene product choices</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* More product-related charts would go here */}
            </div>
          </TabsContent>

          <TabsContent value="health">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awareness of Health Impacts</CardTitle>
                  <CardDescription>Knowledge about harmful effects of plastic-based products</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={awarenessData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {awarenessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* More health-related charts would go here */}
            </div>
          </TabsContent>

          <TabsContent value="practices">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hygiene practices charts would go here */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Findings</CardTitle>
                  <CardDescription>Summary of hygiene practices from the survey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Most respondents change their menstrual products every 4-5 hours</li>
                    <li>The majority dispose of used products in trash bins</li>
                    <li>Many respondents report following good hygiene practices</li>
                    <li>A significant number have never consulted healthcare professionals about menstrual hygiene</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
