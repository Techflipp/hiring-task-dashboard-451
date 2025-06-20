"use client"

import { useQuery } from "@tanstack/react-query"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { useMemo } from "react"
import { apiClient } from "@/lib/apiClient"

interface DemographicsResult {
  gender: string
  age: string
  emotion: string
  ethnicity: string
  timestamp: string
}

interface Props {
  filters: Record<string, string>
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#FF6B6B", "#4ECDC4", "#A29BFE"]

export function DemographicsCharts({ filters }: Props) {
  const { data, isLoading, isError } = useQuery<DemographicsResult[]>({
    queryKey: ["demographics", filters],
    queryFn: async () => {
      const res = await apiClient.get("/demographics/results", { params: filters })
      return res.data
    },
    enabled: !!filters?.camera_id, // don't fetch until camera is selected
  })

  const genderData = useMemo(() => {
    if (!data) return []
    const map = new Map<string, number>()
    data.forEach((item) => {
      map.set(item.gender, (map.get(item.gender) || 0) + 1)
    })
    return Array.from(map, ([key, value]) => ({ name: key, value }))
  }, [data])

  const emotionData = useMemo(() => {
    if (!data) return []
    const map = new Map<string, number>()
    data.forEach((item) => {
      map.set(item.emotion, (map.get(item.emotion) || 0) + 1)
    })
    return Array.from(map, ([key, value]) => ({ name: key, value }))
  }, [data])

  if (!filters?.camera_id) {
    return <p className="text-muted-foreground">Please select a camera to view analytics.</p>
  }

  if (isLoading) return <p>Loading analytics...</p>
  if (isError) return <p className="text-red-500">Failed to load analytics data.</p>
  if (!data || data.length === 0) return <p>No data found for the selected filters.</p>

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={genderData} outerRadius={100} label>
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Emotion Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={emotionData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
