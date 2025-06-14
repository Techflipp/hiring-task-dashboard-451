"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ComparativeAnalytics } from "@/lib/types"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

interface ComparativeAnalyticsChartProps {
  comparativeData: ComparativeAnalytics
}

export function ComparativeAnalyticsChart({ comparativeData }: ComparativeAnalyticsChartProps) {
  const weekdayWeekendData = [
    {
      category: "Male",
      weekday: comparativeData.weekday_vs_weekend.weekday.gender_distribution.male || 0,
      weekend: comparativeData.weekday_vs_weekend.weekend.gender_distribution.male || 0,
    },
    {
      category: "Female",
      weekday: comparativeData.weekday_vs_weekend.weekday.gender_distribution.female || 0,
      weekend: comparativeData.weekday_vs_weekend.weekend.gender_distribution.female || 0,
    },
  ]

  const dayNightData = [
    {
      category: "Happy",
      day: comparativeData.day_vs_night.day.emotion_distribution.happy || 0,
      night: comparativeData.day_vs_night.night.emotion_distribution.happy || 0,
    },
    {
      category: "Sad",
      day: comparativeData.day_vs_night.day.emotion_distribution.sad || 0,
      night: comparativeData.day_vs_night.night.emotion_distribution.sad || 0,
    },
    {
      category: "Neutral",
      day: comparativeData.day_vs_night.day.emotion_distribution.neutral || 0,
      night: comparativeData.day_vs_night.night.emotion_distribution.neutral || 0,
    },
    {
      category: "Angry",
      day: comparativeData.day_vs_night.day.emotion_distribution.angry || 0,
      night: comparativeData.day_vs_night.night.emotion_distribution.angry || 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekday vs Weekend</CardTitle>
          <CardDescription>Gender distribution comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={weekdayWeekendData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                <Radar name="Weekday" dataKey="weekday" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Weekend" dataKey="weekend" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Day vs Night</CardTitle>
          <CardDescription>Emotion distribution comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dayNightData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                <Radar name="Day" dataKey="day" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Radar name="Night" dataKey="night" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 