import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getCamera, getTags } from '@/lib/api'

import { CameraForm } from '@/components/cameras/camera-form'
import { FormSkeleton } from '@/components/cameras/form-skeleton'

type CameraDetailPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: CameraDetailPageProps): Promise<Metadata> => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)
  if (!camera) {
    notFound()
  }

  return {
    title: `Edit ${camera.name} | Camera Management System`,
    description: `Edit camera ${camera.name}`,
  }
}

const Page = async ({ params }: CameraDetailPageProps) => {
  const resolvedParams = await params
  const [camera, tags] = await Promise.all([getCamera(resolvedParams.id), getTags()])
  if (!camera || !tags) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl px-3 py-6 md:px-0">
      <h1 className="mb-6 text-3xl font-bold">Edit Camera</h1>
      <Suspense fallback={<FormSkeleton />}>
        <CameraForm
          camera={camera}
          tags={tags}
        />
      </Suspense>
    </main>
  )
}

export default Page
