"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ConfidenceDistribution } from "@/lib/types"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ConfidenceDistributionChartProps {
  confidenceData: ConfidenceDistribution
}

export function ConfidenceDistributionChart({ confidenceData }: ConfidenceDistributionChartProps) {
  const chartData = confidenceData.detection_confidence.map((item, index) => ({
    range: item.range,
    detection: item.count,
    demographics: confidenceData.demographics_confidence[index]?.count || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Score Distribution</CardTitle>
        <CardDescription>Distribution of detection and demographics confidence scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} detections`,
                  name === "detection" ? "Detection Confidence" : "Demographics Confidence",
                ]}
              />
              <Legend />
              <Bar dataKey="detection" name="Detection" fill="#3b82f6" />
              <Bar dataKey="demographics" name="Demographics" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 