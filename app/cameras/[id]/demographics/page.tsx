import { Suspense } from "react"
import { DemographicsConfigForm } from "@/components/demographics/demographics-config-form"
import { DemographicsConfigSkeleton } from "@/components/demographics/demographics-config-skeleton"

interface DemographicsConfigPageProps {
  params: {
    id: string
  }
}

export default function DemographicsConfigPage({ params }: DemographicsConfigPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <Suspense fallback={<DemographicsConfigSkeleton />}>
        <DemographicsConfigForm cameraId={params.id} />
      </Suspense>
    </div>
  )
}
