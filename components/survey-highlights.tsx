"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchSurveyData, countResponses } from "@/lib/survey-data"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SurveyHighlights() {
  const [loading, setLoading] = useState(true)
  const [productData, setProductData] = useState<{ name: string; value: number }[]>([])
  const [awarenessData, setAwarenessData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    async function loadData() {
      const data = await fetchSurveyData()

      // Product type data
      const productCounts = countResponses(data, "ProductType")
      const productChartData = Object.entries(productCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4) // Top 4 products

      // Awareness data
      const awarenessCounts = countResponses(data, "AwarenessOfHarm")
      const awarenessChartData = Object.entries(awarenessCounts).map(([name, value]) => ({ name, value }))

      setProductData(productChartData)
      setAwarenessData(awarenessChartData)
      setLoading(false)
    }

    loadData()
  }, [])

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-flowwise-burgundy" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Used Products</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Awareness of Health Impacts</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={awarenessData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name.length > 15 ? name.substring(0, 15) + "..." : name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {awarenessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} responses`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-center mt-4">
        <Link href="/data">
          <Button className="bg-flowwise-burgundy hover:bg-flowwise-red">Explore Full Survey Data</Button>
        </Link>
      </div>
    </div>
  )
}
