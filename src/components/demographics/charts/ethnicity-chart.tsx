"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type DemographicsAnalytics, EthnicGroup } from "@/lib/types"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface EthnicityChartProps {
  analytics: DemographicsAnalytics
}

export function EthnicityChart({ analytics }: EthnicityChartProps) {
  const data = [
    {
      name: "White",
      value: analytics.ethnicity_distribution[EthnicGroup.WHITE] || 0,
    },
    {
      name: "African",
      value: analytics.ethnicity_distribution[EthnicGroup.AFRICAN] || 0,
    },
    {
      name: "South Asian",
      value: analytics.ethnicity_distribution[EthnicGroup.SOUTH_ASIAN] || 0,
    },
    {
      name: "East Asian",
      value: analytics.ethnicity_distribution[EthnicGroup.EAST_ASIAN] || 0,
    },
    {
      name: "Middle Eastern",
      value: analytics.ethnicity_distribution[EthnicGroup.MIDDLE_EASTERN] || 0,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethnicity Distribution</CardTitle>
        <CardDescription>Distribution of detected individuals by ethnicity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value} people`, "Count"]} />
              <Legend />
              <Bar dataKey="value" name="Count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
