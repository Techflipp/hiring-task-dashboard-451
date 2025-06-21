import { Suspense } from "react"
import { CameraList } from "@/components/cameras/camera-list"
import { CameraFilters } from "@/components/cameras/camera-filters"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function CamerasPage() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">Camera Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your cameras and configure their settings</p>
        </div>

        <Link
          href="/cameras/new"
          className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 text-sm sm:text-base shadow-lg"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Camera</span>
        </Link>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Suspense fallback={<div className="h-16 glass-card rounded-2xl animate-pulse" />}>
          <CameraFilters />
        </Suspense>

        <Suspense fallback={<div className="h-96 glass-card rounded-2xl animate-pulse" />}>
          <CameraList />
        </Suspense>
      </div>
    </div>
  )
}
