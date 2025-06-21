import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">Welcome to CameraVision</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Monitor your cameras and analyze demographics data in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Suspense fallback={<div className="h-32 glass-card rounded-2xl animate-pulse" />}>
            <DashboardStats />
          </Suspense>

          <Suspense fallback={<div className="h-64 glass-card rounded-2xl animate-pulse" />}>
            <RecentActivity />
          </Suspense>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
