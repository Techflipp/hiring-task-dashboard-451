import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCamera } from '@/lib/api'
import { EmptyState } from '@/components/ui/empty-list'
import { Navbar } from '@/components/navbar'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: LayoutProps): Promise<Metadata> => {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)

  return {
    title: `Demographics Results - ${camera?.name || 'Camera'} | Camera Management System`,
    description: `Analytics and insights for ${camera?.name || 'camera'}`,
  }
}

export default async function DemographicsResultsLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params
  const camera = await getCamera(resolvedParams.id)

  if (!camera) {
    notFound()
  }

  if (!camera.demographics_config) {
    return (
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Demographics Results</h1>
        <EmptyState
          title="No Demographics Configuration"
          description="This camera does not have demographics configuration set up yet."
          icon="file"
        />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Navbar />

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Demographics Results</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Analytics and insights for {camera.name}</p>
      </div>

      <Suspense>{children}</Suspense>
    </main>
  )
}
