"use client"

import type { DemographicsResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts"
import { formatEnumValue } from "@/lib/utils"

interface AnalyticsChartsProps {
  data: DemographicsResult[]
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : []

  // Early return if no data
  if (validData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>No demographic data to display charts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a camera and adjust filters to view analytics charts.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Process data for charts using validData instead of data
  const genderData = validData.reduce(
    (acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ageData = validData.reduce(
    (acc, item) => {
      acc[item.age] = (acc[item.age] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const emotionData = validData.reduce(
    (acc, item) => {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ethnicityData = validData.reduce(
    (acc, item) => {
      acc[item.ethnicity] = (acc[item.ethnicity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to chart format
  const genderChartData = Object.entries(genderData).map(([key, value]) => ({
    name: formatEnumValue(key),
    value,
    fill: key === "male" ? "#3b82f6" : "#ec4899",
  }))

  const ageChartData = Object.entries(ageData).map(([key, value]) => ({
    name: key,
    value,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }))

  const emotionChartData = Object.entries(emotionData).map(([key, value]) => ({
    name: formatEnumValue(key),
    value,
  }))

  const ethnicityChartData = Object.entries(ethnicityData).map(([key, value]) => ({
    name: formatEnumValue(key),
    value,
  }))

  // Hourly distribution
  const hourlyData = validData.reduce(
    (acc, item) => {
      const hour = new Date(item.timestamp).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const hourlyChartData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    detections: hourlyData[i] || 0,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Breakdown by gender</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Breakdown by age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emotion Analysis</CardTitle>
          <CardDescription>Detected emotions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ethnicity Distribution</CardTitle>
          <CardDescription>Breakdown by ethnicity</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ethnicityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ethnicityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Hourly Detection Pattern</CardTitle>
          <CardDescription>Detections throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              detections: {
                label: "Detections",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyChartData}>
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-5))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
