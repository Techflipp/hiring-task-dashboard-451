"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { AnalyticsCharts } from "./analytics-charts"
import { AnalyticsStats } from "./analytics-stats"
import { AnalyticsTable } from "./analytics-table"

export function AnalyticsDashboard() {
  const searchParams = useSearchParams()

  const params = {
    camera_id: searchParams.get("camera_id") || "",
    gender: searchParams.get("gender") === "all" ? undefined : searchParams.get("gender") || undefined,
    age: searchParams.get("age") === "all" ? undefined : searchParams.get("age") || undefined,
    emotion: searchParams.get("emotion") === "all" ? undefined : searchParams.get("emotion") || undefined,
    ethnicity: searchParams.get("ethnicity") === "all" ? undefined : searchParams.get("ethnicity") || undefined,
    start_date: searchParams.get("start_date") || undefined,
    end_date: searchParams.get("end_date") || undefined,
  }

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["demographics-results", params],
    queryFn: () => {
      if (!params.camera_id || params.camera_id.trim() === "") {
        return { data: [], analytics: null }
      }
      return apiClient.getDemographicsResults(params as any)
    },
    enabled: !!params.camera_id && params.camera_id.trim() !== "",
  })

  if (!params.camera_id || params.camera_id.trim() === "") {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Select a Camera</h3>
        <p className="text-sm sm:text-base text-gray-600">
          Choose a camera from the filters above to view demographics analytics
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Failed to load analytics</h3>
        <p className="text-sm sm:text-base text-gray-600">Please try again later</p>
      </div>
    )
  }

  if (!results?.data?.length) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No data found</h3>
        <p className="text-sm sm:text-base text-gray-600">No demographics data available for the selected filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <AnalyticsStats data={results.data} />
      <AnalyticsCharts data={results.data} />
      <AnalyticsTable data={results.data} />
    </div>
  )
}
