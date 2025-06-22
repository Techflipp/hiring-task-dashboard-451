import { Suspense } from "react"
import { CameraCreateForm } from "@/components/cameras/camera-create-form"
import { CameraCreateSkeleton } from "@/components/cameras/camera-create-skeleton"

export default function CameraCreatePage() {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <Suspense fallback={<CameraCreateSkeleton />}>
        <CameraCreateForm />
      </Suspense>
    </div>
  )
}
