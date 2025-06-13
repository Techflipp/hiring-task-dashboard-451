"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type DemographicsAnalytics, Age } from "@/lib/types"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface AgeChartProps {
  analytics: DemographicsAnalytics
}

export function AgeChart({ analytics }: AgeChartProps) {
  const data = [
    {
      name: "0-18",
      value: analytics.age_distribution[Age.ZERO_EIGHTEEN] || 0,
    },
    {
      name: "19-30",
      value: analytics.age_distribution[Age.NINETEEN_THIRTY] || 0,
    },
    {
      name: "31-45",
      value: analytics.age_distribution[Age.THIRTYONE_FORTYFIVE] || 0,
    },
    {
      name: "46-60",
      value: analytics.age_distribution[Age.FORTYSIX_SIXTY] || 0,
    },
    {
      name: "60+",
      value: analytics.age_distribution[Age.SIXTYPLUS] || 0,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Distribution</CardTitle>
        <CardDescription>Distribution of detected individuals by age group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
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
