import { Suspense } from "react"
import { CameraEditForm } from "@/components/cameras/camera-edit-form"
import { CameraEditSkeleton } from "@/components/cameras/camera-edit-skeleton"

interface CameraEditPageProps {
  params: {
    id: string
  }
}

export default function CameraEditPage({ params }: CameraEditPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <Suspense fallback={<CameraEditSkeleton />}>
        <CameraEditForm cameraId={params.id} />
      </Suspense>
    </div>
  )
}
