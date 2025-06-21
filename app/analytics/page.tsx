import { Suspense } from "react"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton"

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">Demographics Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600">Analyze demographic data from your cameras</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Suspense fallback={<div className="h-32 glass-card rounded-2xl animate-pulse" />}>
          <AnalyticsFilters />
        </Suspense>

        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </div>
  )
}
