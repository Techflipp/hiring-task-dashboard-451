"use client";

import { Users, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import type { components } from "@/services/api/types";

type Analytics = components["schemas"]["Analytics"];

interface AnalyticsSummaryProps {
  analytics: Analytics;
}

export function AnalyticsSummary({ analytics }: AnalyticsSummaryProps) {
  const cards = [
    {
      title: "Total Visitors",
      value: analytics.total_count.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Gender Distribution",
      value: `${Object.keys(analytics.gender_distribution).length} categories`,
      icon: BarChart3,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Age Groups",
      value: `${Object.keys(analytics.age_distribution).length} ranges`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Emotion Types",
      value: `${Object.keys(analytics.emotion_distribution).length} emotions`,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon size={24} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
