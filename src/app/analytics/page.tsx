"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { camerasApi, demographicsApi } from "@/lib/api"
import { AnalyticsFilters as AnalyticsFiltersComponent } from "@/components/analytics-filters"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsTable } from "@/components/analytics-table"
import { ErrorMessage } from "@/components/error-message"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsFilters {
  camera_id: string
  gender?: string
  age?: string
  emotion?: string
  ethnicity?: string
  start_date?: string
  end_date?: string
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    camera_id: "",
  })

  // Get cameras for filter dropdown
  const { data: camerasData } = useQuery({
    queryKey: ["cameras-list"],
    queryFn: () => camerasApi.getList({ size: 100 }),
  })

  // Get demographics results based on filters
  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["demographics-results", filters],
    queryFn: () => demographicsApi.getResults(filters),
    enabled: !!filters.camera_id,
  })

  const handleFiltersChange = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load analytics data"
        message="There was an error loading the analytics information. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demographics Analytics</h1>
        <p className="text-muted-foreground">Analyze demographic data collected by your cameras</p>
      </div>

      <AnalyticsFiltersComponent
        cameras={camerasData?.items || []}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {!filters.camera_id ? (
        <Card>
          <CardHeader>
            <CardTitle>Select a Camera</CardTitle>
            <CardDescription>Choose a camera from the filters above to view its demographic analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics data will be displayed here once you select a camera.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      ) : results ? (
        <div className="space-y-6">
          <AnalyticsCharts data={results} />
          <AnalyticsTable data={results} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>No demographic data found for the selected filters</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Try adjusting your filters or check if the camera has demographics configuration enabled.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
