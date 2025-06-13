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
  if (!camera) {
    notFound()
  }

  return {
    title: `Demographics Results for ${camera.name} | Camera Management System`,
    description: `View demographics analytics for camera ${camera.name}`,
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
      <div className="container py-6">
        <h1 className="mb-6 text-3xl font-bold">Demographics Results</h1>
        <EmptyState
          title="No Demographics Configuration"
          description="This camera does not have demographics configuration set up yet."
          icon="file"
        />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-3 py-6 md:px-0">
      <Navbar />

      <h1 className="mb-2 text-3xl font-bold">Demographics Results</h1>
      <p className="text-muted-foreground mb-6">Analytics and insights for {camera.name}</p>

      <Suspense>{children}</Suspense>
    </main>
  )
}
