'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyDistribution } from '@/lib/types'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'

interface DailyPatternChartProps {
  dailyData: DailyDistribution[]
}

export function DailyPatternChart({ dailyData }: DailyPatternChartProps) {
  const chartData = dailyData.map((item) => ({
    day: item.day.slice(0, 3), // Shorten day names
    count: item.count,
    peakHour: item.peak_hour,
    fullDay: item.day,
  }))

  const getBarColor = (count: number, maxCount: number) => {
    const intensity = count / maxCount
    if (intensity > 0.8) return '#ef4444'
    if (intensity > 0.6) return '#f97316'
    if (intensity > 0.4) return '#eab308'
    if (intensity > 0.2) return '#22c55e'
    return '#3b82f6'
  }

  const maxCount = Math.max(...chartData.map((d) => d.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Patterns</CardTitle>
        <CardDescription>Detection patterns across days of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} detections`, 'Count']}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload
                  return data ? `${data.fullDay} (Peak: ${data.peakHour}:00)` : label
                }}
              />
              <Bar
                dataKey="count"
                name="Detections"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.count, maxCount)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
