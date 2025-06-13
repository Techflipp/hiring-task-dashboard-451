import { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { CameraListSkeleton } from '@/components/cameras/camera-list-skeleton'
import { CameraList } from '@/components/cameras/camera-list'
import { getCameras } from '@/lib/api'
import { createServerQueryClient } from '@/lib/query-client'

type PageProps = {
  searchParams: Promise<{ page?: string; size?: string; camera_name?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const queryClient = createServerQueryClient()
  const dehydratedState = dehydrate(queryClient)
  const resolvedSearchParams = await searchParams

  const page = resolvedSearchParams.page ? Number.parseInt(resolvedSearchParams.page) : 1
  const size = resolvedSearchParams.size ? Number.parseInt(resolvedSearchParams.size) : 20
  const cameraName = resolvedSearchParams.camera_name

  await queryClient.prefetchQuery({
    queryKey: ['cameras', page, size, cameraName],
    queryFn: () => getCameras(page, size, cameraName),
    staleTime: 60 * 1000,
  })

  return (
    <main className="container mx-auto px-3 py-6 md:px-0">
      <h1 className="mb-6 text-3xl font-bold">Cameras</h1>
      <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<CameraListSkeleton />}>
          <CameraList
            page={page}
            size={size}
            cameraName={cameraName}
          />
        </Suspense>
      </HydrationBoundary>
    </main>
  )
}

export default Page
