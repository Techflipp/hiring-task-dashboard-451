import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCamera, getDemographicsResults } from '@/lib/api'
import { ResultsFilter } from '@/components/demographics/results-filter'
import { GenderChart } from '@/components/demographics/charts/gender-chart'
import { AgeChart } from '@/components/demographics/charts/age-chart'
import { EmotionChart } from '@/components/demographics/charts/emotion-chart'
import { EthnicityChart } from '@/components/demographics/charts/ethnicity-chart'
import { TimeSeriesChart } from '@/components/demographics/charts/time-series-chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'
import type { Age, DemographicsFilters, Emotion, EthnicGroup, Gender } from '@/lib/types'
import { EmptyState } from '@/components/ui/empty-list'

type ResultsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    camera_id?: string
    gender?: string
    age?: string
    emotion?: string
    ethnicity?: string
    start_date?: string
    end_date?: string
  }>
}

export const generateMetadata = async ({ params }: ResultsPageProps): Promise<Metadata> => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)
  if (!camera) {
    notFound()
  }

  return {
    title: `Demographics Results for ${camera.name} | Camera Management System`,
    description: `View demographics analytics for camera ${camera.name}`,
  }
}

export default async function DemographicsResultsPage({ params, searchParams }: ResultsPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const camera = await getCamera(resolvedParams.id)
  if (!camera) {
    notFound()
  }

  if (!camera.demographics_config) {
    return (
      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold">Demographics Results</h1>
        <EmptyState
          title="No Demographics Configuration"
          description="This camera does not have demographics configuration set up yet."
          icon="file"
        />
      </div>
    )
  }

  const filters: DemographicsFilters = {
    camera_id: resolvedParams.id,
    gender: resolvedSearchParams.gender as Gender,
    age: resolvedSearchParams.age as Age,
    emotion: resolvedSearchParams.emotion as Emotion,
    ethnicity: resolvedSearchParams.ethnicity as EthnicGroup,
    start_date: resolvedSearchParams.start_date,
    end_date: resolvedSearchParams.end_date,
  }

  const resultsData = await getDemographicsResults(filters)
  if (!resultsData) {
    return (
      <EmptyState
        title="No Results Found"
        description="No demographics data found for the selected filters."
        icon="file"
      />
    )
  }

  return (
    <main className="container mx-auto px-3 py-6 md:px-0">
      <h1 className="mb-2 text-3xl font-bold">Demographics Results</h1>
      <p className="text-muted-foreground mb-6">Analytics and insights for {camera.name}</p>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <ResultsFilter cameraId={resolvedParams.id} />
      </Suspense>

      <div className="mt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <GenderChart analytics={resultsData.analytics} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <AgeChart analytics={resultsData.analytics} />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <EmotionChart analytics={resultsData.analytics} />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <EthnicityChart analytics={resultsData.analytics} />
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-[300px]" />}>
            <TimeSeriesChart analytics={resultsData.analytics} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
