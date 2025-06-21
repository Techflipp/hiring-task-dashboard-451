"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface AnalyticsChartsProps {
  data: any[]
}

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const genderData = data.reduce(
    (acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ageData = data.reduce(
    (acc, item) => {
      acc[item.age] = (acc[item.age] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const emotionData = data.reduce(
    (acc, item) => {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const ethnicityData = data.reduce(
    (acc, item) => {
      acc[item.ethnicity] = (acc[item.ethnicity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const genderChartData = Object.entries(genderData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const ageChartData = Object.entries(ageData).map(([key, value]) => ({
    name: key,
    value,
  }))

  const emotionChartData = Object.entries(emotionData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  const ethnicityChartData = Object.entries(ethnicityData).map(([key, value]) => ({
    name: key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
  }))

  const timeSeriesData = data.reduce(
    (acc, item) => {
      const hour = new Date(item.timestamp).getHours()
      const key = `${hour}:00`
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const timeChartData = Object.entries(timeSeriesData)
    .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
    .map(([key, value]) => ({
      time: key,
      detections: value,
    }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={genderChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {genderChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Age Groups</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ageChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Emotion Analysis</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={emotionChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ethnicity Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={ethnicityChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {ethnicityChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {timeChartData.length > 0 && (
        <div className="glass-card rounded-2xl p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Detections Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="detections" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
