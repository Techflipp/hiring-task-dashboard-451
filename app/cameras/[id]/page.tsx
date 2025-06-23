import { Suspense } from "react"
import CameraDetail from "@/components/camera-detail"
import { notFound } from "next/navigation"

interface CameraPageProps {
  params: {
    id: string
  }
}

export default function CameraPage({ params }: CameraPageProps) {
  if (!params.id) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading camera details...</div>}>
        <CameraDetail cameraId={params.id} />
      </Suspense>
    </div>
  )
}
