'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ResultsFilter } from '@/components/demographics/results-filter'
import {
  DynamicGenderChart,
  DynamicAgeChart,
  DynamicEmotionChart,
  DynamicEthnicityChart,
} from '@/components/demographics/charts/dynamic-charts'
import { ComparativeAnalyticsChart } from '@/components/demographics/charts/comparative-analytics-chart'
import { ConfidenceDistributionChart } from '@/components/demographics/charts/confidence-distribution-chart'
import { DailyPatternChart } from '@/components/demographics/charts/daily-pattern-chart'
import type { Age, DemographicsFilters, Emotion, EthnicGroup, Gender } from '@/lib/types'
import { useDemographicsResults } from '@/hooks/use-demographics'
import { Skeleton } from '@/components/ui/skeleton'

function ChartsGrid({ filters }: { filters: DemographicsFilters }) {
  const { data, isLoading, error } = useDemographicsResults(filters)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[500px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    )
  }

  if (error || !data) {
    console.log(error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Basic Demographics Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DynamicGenderChart filters={filters} />
        <DynamicAgeChart filters={filters} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DynamicEmotionChart filters={filters} />
        <DynamicEthnicityChart filters={filters} />
      </div>

      {/* Enhanced Analytics Charts */}
      <ComparativeAnalyticsChart comparativeData={data.analytics.comparative_analytics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DailyPatternChart dailyData={data.analytics.daily_distribution} />
        <ConfidenceDistributionChart confidenceData={data.analytics.confidence_distribution} />
      </div>
    </div>
  )
}

export default function DemographicsResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const filters: DemographicsFilters = {
    camera_id: params.id as string,
    gender: searchParams.get('gender') as Gender,
    age: searchParams.get('age') as Age,
    emotion: searchParams.get('emotion') as Emotion,
    ethnicity: searchParams.get('ethnicity') as EthnicGroup,
    start_date: searchParams.get('start_date') || undefined,
    end_date: searchParams.get('end_date') || undefined,
  }

  return (
    <div className="space-y-6">
      <ResultsFilter cameraId={params.id as string} />

      <Suspense fallback={
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-lg" />
          ))}
        </div>
      }>
        <ChartsGrid filters={filters} />
      </Suspense>
    </div>
  )
}
