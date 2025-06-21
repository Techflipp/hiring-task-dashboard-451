import { Suspense } from "react"
import { CameraDetails } from "@/components/cameras/camera-details"
import { CameraDetailsSkeleton } from "@/components/cameras/camera-details-skeleton"

interface CameraDetailPageProps {
  params: {
    id: string
  }
}

export default function CameraDetailPage({ params }: CameraDetailPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <Suspense fallback={<CameraDetailsSkeleton />}>
        <CameraDetails cameraId={params.id} />
      </Suspense>
    </div>
  )
}
