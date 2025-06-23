import { Suspense } from "react"
import CameraEditForm from "@/components/camera-edit-form"

interface CameraEditPageProps {
  params: {
    id: string
  }
}

export default function CameraEditPage({ params }: CameraEditPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Camera</h1>
      <Suspense fallback={<div>Loading camera form...</div>}>
        <CameraEditForm cameraId={params.id} />
      </Suspense>
    </div>
  )
}
