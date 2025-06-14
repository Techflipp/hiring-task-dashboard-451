import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCamera } from '@/lib/api'
import { ConfigForm } from '@/components/demographics/config-form'
import type { Metadata } from 'next'
import { FormSkeleton } from '@/components/cameras/form-skeleton'
import { Navbar } from '@/components/navbar'

type ConfigPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: ConfigPageProps): Promise<Metadata> => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)
  if (!camera) {
    notFound()
  }

  return {
    title: `Demographics Config for ${camera.name} | Camera Management System`,
    description: `Configure demographics settings for camera ${camera.name}`,
  }
}

const Page = async ({ params }: ConfigPageProps) => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)
  if (!camera) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl px-3 py-6 md:px-0">
      <Navbar />

      <h1 className="mb-2 text-3xl font-bold">Demographics Configuration</h1>
      <p className="text-muted-foreground mb-6">
        {camera.demographics_config
          ? `Update demographics configuration for ${camera.name}`
          : `Create demographics configuration for ${camera.name}`}
      </p>
      <Suspense fallback={<FormSkeleton />}>
        <ConfigForm
          camera={camera}
          config={camera.demographics_config || undefined}
        />
      </Suspense>
    </main>
  )
}

export default Page
