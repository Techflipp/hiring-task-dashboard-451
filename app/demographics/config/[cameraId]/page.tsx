import { Suspense } from "react"
import { notFound } from "next/navigation"
import DemographicsConfigForm from "@/components/demographics-config-form"
import { ConfigFormSkeleton } from "@/components/camera-skeletons"
import { getCameraById } from "@/lib/cameras"

export default async function DemographicsConfigPage({ params }: { params: { cameraId: string } }) {
  try {
    const camera = await getCameraById(params.cameraId)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Demographics Configuration</h1>
        <h2 className="text-xl mb-4">Camera: {camera.name}</h2>
        <Suspense fallback={<ConfigFormSkeleton />}>
          <DemographicsConfigForm cameraId={params.cameraId} />
        </Suspense>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
