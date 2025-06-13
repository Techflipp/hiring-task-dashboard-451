import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCamera } from '@/lib/api'
import type { Metadata } from 'next'
import { CameraDetailSkeleton } from '@/components/cameras/camera-list-skeleton'
import { CameraDetail } from '@/components/cameras/camera-detail'

type CameraDetailPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: CameraDetailPageProps): Promise<Metadata> => {
  try {
    const resolvedParams = await params
    const camera = await getCamera(resolvedParams?.id)
    return {
      title: `${camera?.name} | Camera Management System`,
      description: `Details for camera ${camera?.name}`,
    }
  } catch {
    notFound()
  }
}

const Page = async ({ params }: CameraDetailPageProps) => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)

  if (!camera) {
    notFound()
  }

  return (
    <main className="container mx-auto px-3 py-6 md:px-0">
      <Suspense fallback={<CameraDetailSkeleton />}>
        <CameraDetail camera={camera} />
      </Suspense>
    </main>
  )
}

export default Page
