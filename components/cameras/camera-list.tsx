"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { CameraCard } from "./camera-card"
import { CameraPagination } from "./camera-pagination"
import { CameraListSkeleton } from "./camera-list-skeleton"

export function CameraList() {
  const searchParams = useSearchParams()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const size = Number.parseInt(searchParams.get("size") || "12")
  const camera_name = searchParams.get("camera_name") || undefined
  const status = searchParams.get("status") || undefined
  const hasConfig = searchParams.get("hasConfig") || undefined
  const sortBy = searchParams.get("sortBy") || undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ["cameras", { page, size, camera_name, status, hasConfig, sortBy }],
    queryFn: () => apiClient.getCameras({ page, size, camera_name }),
  })

  if (isLoading) return <CameraListSkeleton />

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Failed to load cameras</h3>
        <p className="text-sm sm:text-base text-gray-600">Please try again later</p>
      </div>
    )
  }

  let filteredCameras = data?.items || []

  if (camera_name && camera_name.trim() !== "") {
    filteredCameras = filteredCameras.filter((camera: any) =>
      camera.name.toLowerCase().includes(camera_name.toLowerCase()),
    )
  }

  if (status && status !== "all") {
    filteredCameras = filteredCameras.filter((camera: any) => {
      const isOnline = !!camera.rtsp_url && camera.rtsp_url.trim() !== ""
      return status === "online" ? isOnline : !isOnline
    })
  }

  if (hasConfig && hasConfig !== "all") {
    filteredCameras = filteredCameras.filter((camera: any) => {
      const hasConfiguration = !!camera.demographics_config
      return hasConfig === "yes" ? hasConfiguration : !hasConfiguration
    })
  }

  if (sortBy) {
    filteredCameras.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        default:
          return 0
      }
    })
  }

  if (!filteredCameras.length) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No cameras found</h3>
        <p className="text-sm sm:text-base text-gray-600">
          {camera_name
            ? `No cameras found matching "${camera_name}"`
            : "Try adjusting your filters or add your first camera to get started"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredCameras.map((camera: any) => (
          <CameraCard key={camera.id} camera={camera} />
        ))}
      </div>

      <CameraPagination
        currentPage={page}
        totalPages={Math.ceil(filteredCameras.length / size)}
        totalItems={filteredCameras.length}
        itemsPerPage={size}
      />
    </div>
  )
}
