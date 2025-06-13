'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { ResultsFilter } from '@/components/demographics/results-filter'
import {
  DynamicGenderChart,
  DynamicAgeChart,
  DynamicEmotionChart,
  DynamicEthnicityChart,
} from '@/components/demographics/charts/dynamic-charts'
import type { Age, DemographicsFilters, Emotion, EthnicGroup, Gender } from '@/lib/types'

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

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DynamicGenderChart filters={filters} />
          <DynamicAgeChart filters={filters} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DynamicEmotionChart filters={filters} />
          <DynamicEthnicityChart filters={filters} />
        </div>
      </div>
    </div>
  )
}
