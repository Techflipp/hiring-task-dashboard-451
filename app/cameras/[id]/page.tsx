import { Suspense } from "react"
import { notFound } from "next/navigation"
import CameraDetails from "@/components/camera-details"
import DemographicsResults from "@/components/demographics-results"
import { CameraDetailsSkeleton, DemographicsResultsSkeleton } from "@/components/camera-skeletons"
import { getCameraById } from "@/lib/cameras"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const camera = await getCameraById(params.id)
    return {
      title: `${camera.name} - Camera Details`,
      description: `Details and analytics for camera ${camera.name}`,
    }
  } catch (error) {
    return {
      title: "Camera Details",
      description: "Camera details and analytics",
    }
  }
}

export default async function CameraDetailsPage({ params }: { params: { id: string } }) {
  try {
    const camera = await getCameraById(params.id)

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<CameraDetailsSkeleton />}>
          <CameraDetails cameraId={params.id} initialData={camera} />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Demographics Analytics</h2>
          <Suspense fallback={<DemographicsResultsSkeleton />}>
            <DemographicsResults cameraId={params.id} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
