'use client'

import { DemographicsAnalyticsDashboard } from '@/components/dashboard/DemographicAnalyticsDashboard'
import { usePathname } from 'next/navigation'

export default function AnalyticsPage() {
  const pathname = usePathname()
  const id = pathname.split('/')[2] // /cameras/[id]/analytics
  return <DemographicsAnalyticsDashboard cameraId={id} />
}
