"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type DemographicsAnalytics, Gender } from "@/lib/types"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

interface GenderChartProps {
  analytics: DemographicsAnalytics
}

export function GenderChart({ analytics }: GenderChartProps) {
  const data = [
    {
      name: "Male",
      value: analytics.gender_distribution[Gender.MALE] || 0,
    },
    {
      name: "Female",
      value: analytics.gender_distribution[Gender.FEMALE] || 0,
    },
  ]

  const COLORS = ["#3b82f6", "#ec4899"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <CardDescription>Distribution of detected individuals by gender</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} people`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
