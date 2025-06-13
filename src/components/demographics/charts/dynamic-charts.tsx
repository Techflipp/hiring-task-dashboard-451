'use client'

import { useDemographicsResults } from '@/hooks/use-demographics'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-list'
import { GenderChart } from './gender-chart'
import { AgeChart } from './age-chart'
import { EmotionChart } from './emotion-chart'
import { EthnicityChart } from './ethnicity-chart'
import type { DemographicsFilters } from '@/lib/types'

interface DynamicChartProps {
  filters: DemographicsFilters
}

export function DynamicGenderChart({ filters }: DynamicChartProps) {
  const { data: resultsData, isLoading, error } = useDemographicsResults(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] rounded-lg" />
  }

  if (error || !resultsData) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg">
        <EmptyState
          title="Failed to Load"
          description="Unable to load gender chart data"
          icon="file"
        />
      </div>
    )
  }

  return <GenderChart analytics={resultsData.analytics} />
}

export function DynamicAgeChart({ filters }: DynamicChartProps) {
  const { data: resultsData, isLoading, error } = useDemographicsResults(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] rounded-lg" />
  }

  if (error || !resultsData) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg">
        <EmptyState
          title="Failed to Load"
          description="Unable to load age chart data"
          icon="file"
        />
      </div>
    )
  }

  return <AgeChart analytics={resultsData.analytics} />
}

export function DynamicEmotionChart({ filters }: DynamicChartProps) {
  const { data: resultsData, isLoading, error } = useDemographicsResults(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] rounded-lg" />
  }

  if (error || !resultsData) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg">
        <EmptyState
          title="Failed to Load"
          description="Unable to load emotion chart data"
          icon="file"
        />
      </div>
    )
  }

  return <EmotionChart analytics={resultsData.analytics} />
}

export function DynamicEthnicityChart({ filters }: DynamicChartProps) {
  const { data: resultsData, isLoading, error } = useDemographicsResults(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] rounded-lg" />
  }

  if (error || !resultsData) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg">
        <EmptyState
          title="Failed to Load"
          description="Unable to load ethnicity chart data"
          icon="file"
        />
      </div>
    )
  }

  return <EthnicityChart analytics={resultsData.analytics} />
}
