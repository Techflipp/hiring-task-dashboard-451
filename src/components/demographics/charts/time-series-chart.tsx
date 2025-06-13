"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DemographicsAnalytics } from "@/lib/types"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { format, parseISO } from "date-fns"

interface TimeSeriesChartProps {
  analytics: DemographicsAnalytics
}

export function TimeSeriesChart({ analytics }: TimeSeriesChartProps) {
  const data = (analytics?.time_series_data || []).map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.timestamp), "MMM d, HH:mm"),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Over Time</CardTitle>
        <CardDescription>Number of detections over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value) => [`${value} people`, "Count"]}
              />
              <Legend />
              <Line type="monotone" dataKey="count" name="Detections" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
