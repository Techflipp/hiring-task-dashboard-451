"use client"

import { Users, User, Heart, Smile } from "lucide-react"

interface AnalyticsStatsProps {
  data: any[]
}

export function AnalyticsStats({ data }: AnalyticsStatsProps) {
  const totalDetections = data.length
  const uniqueGenders = new Set(data.map((d) => d.gender)).size
  const avgConfidence = data.reduce((sum, d) => sum + d.confidence, 0) / data.length
  const mostCommonEmotion = data.reduce(
    (acc, d) => {
      acc[d.emotion] = (acc[d.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topEmotion = Object.entries(mostCommonEmotion).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

  const stats = [
    {
      title: "Total Detections",
      value: totalDetections.toLocaleString(),
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Gender Diversity",
      value: uniqueGenders,
      icon: User,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
    },
    {
      title: "Avg Confidence",
      value: `${(avgConfidence * 100).toFixed(1)}%`,
      icon: Heart,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Top Emotion",
      value: topEmotion.charAt(0).toUpperCase() + topEmotion.slice(1),
      icon: Smile,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`glass-card rounded-2xl p-3 sm:p-4 lg:p-6 bg-gradient-to-br ${stat.bgColor} border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</div>
          </div>
        )
      })}
    </div>
  )
}
