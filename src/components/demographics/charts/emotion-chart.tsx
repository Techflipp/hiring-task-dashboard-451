"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type DemographicsAnalytics, Emotion } from "@/lib/types"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"

interface EmotionChartProps {
  analytics: DemographicsAnalytics
}

export function EmotionChart({ analytics }: EmotionChartProps) {
  const data = [
    {
      emotion: "Happy",
      value: analytics.emotion_distribution[Emotion.HAPPY] || 0,
    },
    {
      emotion: "Sad",
      value: analytics.emotion_distribution[Emotion.SAD] || 0,
    },
    {
      emotion: "Angry",
      value: analytics.emotion_distribution[Emotion.ANGRY] || 0,
    },
    {
      emotion: "Fear",
      value: analytics.emotion_distribution[Emotion.FEAR] || 0,
    },
    {
      emotion: "Surprise",
      value: analytics.emotion_distribution[Emotion.SURPRISE] || 0,
    },
    {
      emotion: "Neutral",
      value: analytics.emotion_distribution[Emotion.NEUTRAL] || 0,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Distribution</CardTitle>
        <CardDescription>Distribution of detected emotions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="emotion" />
              <PolarRadiusAxis />
              <Tooltip formatter={(value) => [`${value} people`, "Count"]} />
              <Radar name="Emotions" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
