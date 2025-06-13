import { Suspense } from 'react'

import { CameraListSkeleton } from '@/components/cameras/camera-list-skeleton'
import { CameraList } from '@/components/cameras/camera-list'

type PageProps = {
  searchParams: Promise<{ page?: string; size?: string; camera_name?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams

  const page = resolvedSearchParams.page ? Number.parseInt(resolvedSearchParams.page) : 1
  const size = resolvedSearchParams.size ? Number.parseInt(resolvedSearchParams.size) : 20
  const cameraName = resolvedSearchParams.camera_name

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Cameras</h1>
      <Suspense fallback={<CameraListSkeleton />}>
        <CameraList
          page={page}
          size={size}
          cameraName={cameraName}
        />
      </Suspense>
    </div>
  )
}

export default Page
