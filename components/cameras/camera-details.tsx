"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"
import { ArrowLeft, Edit, Settings, BarChart3, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CameraDetailsProps {
  cameraId: string
}

export function CameraDetails({ cameraId }: CameraDetailsProps) {
  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => apiClient.getCamera(cameraId),
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !camera) {
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
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Camera not found</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          The camera with ID "{cameraId}" doesn't exist or couldn't be loaded
        </p>
        <Link href="/cameras" className="btn-gradient px-4 py-2 rounded-xl text-sm">
          Back to Cameras
        </Link>
      </div>
    )
  }

  const cameraName = camera?.name || "Unnamed Camera"
  const cameraId_display = camera?.id || cameraId
  const rtspUrl = camera?.rtsp_url || ""
  const isOnline = !!(rtspUrl && rtspUrl.trim() !== "")
  const hasConfig = !!camera?.demographics_config

  const streamWidth = camera?.stream_frame_width || 1920
  const streamHeight = camera?.stream_frame_height || 1080
  const streamFps = camera?.stream_fps || 30
  const streamQuality = camera?.stream_quality || 90
  const streamMaxLength = camera?.stream_max_length || 300
  const streamSkipFrames = camera?.stream_skip_frames || 0

  const createdAt = camera?.created_at ? new Date(camera.created_at).toLocaleDateString() : "Unknown"
  const tags = camera?.tags || []

  return (
    <div className="space-y-4 sm:space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/cameras"
            className="p-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </Link>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">{cameraName}</h1>
            <p className="text-xs sm:text-sm text-gray-600">Camera ID: {cameraId_display}</p>
          </div>
        </div>

        <div className="flex space-x-2 sm:space-x-3">
          <Link
            href={`/cameras/${cameraId_display}/edit`}
            className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 text-sm sm:text-base"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Edit Camera</span>
          </Link>

          {hasConfig && (
            <Link
              href={`/analytics?camera_id=${cameraId_display}`}
              className="btn-gradient-secondary px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center space-x-2 text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Analytics</span>
            </Link>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Status</h2>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Online</Badge>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <Badge variant="secondary">Offline</Badge>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/50 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Resolution</div>
            <div className="text-sm sm:text-base font-bold text-gray-900">
              {streamWidth} × {streamHeight}
            </div>
          </div>

          <div className="bg-white/50 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Frame Rate</div>
            <div className="text-sm sm:text-base font-bold text-gray-900">{streamFps} FPS</div>
          </div>

          <div className="bg-white/50 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Quality</div>
            <div className="text-sm sm:text-base font-bold text-gray-900">{streamQuality}%</div>
          </div>

          <div className="bg-white/50 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Max Length</div>
            <div className="text-sm sm:text-base font-bold text-gray-900">{streamMaxLength}s</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Camera Information</h2>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-600">RTSP URL</label>
              <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm font-mono break-all">
                {rtspUrl || "Not configured"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">Skip Frames</label>
                <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">{streamSkipFrames}</div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600">Created</label>
                <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">{createdAt}</div>
              </div>
            </div>

            {tags.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tags.map((tag: any, index: number) => (
                    <Badge key={tag?.id || index} variant="secondary" className="text-xs">
                      {tag?.name || `Tag ${index + 1}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Demographics Configuration</h2>
            {hasConfig ? (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Configured</Badge>
            ) : (
              <Badge variant="secondary">Not Configured</Badge>
            )}
          </div>

          {hasConfig && camera.demographics_config ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Detection Confidence</label>
                  <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">
                    {((camera.demographics_config.detection_confidence_threshold || 0.6) * 100).toFixed(1)}%
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Demographics Confidence</label>
                  <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">
                    {((camera.demographics_config.demographics_confidence_threshold || 0.6) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Exit Threshold</label>
                  <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">
                    {camera.demographics_config.exit_threshold || 30}s
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Save Interval</label>
                  <div className="mt-1 p-2 sm:p-3 bg-white/50 rounded-lg text-xs sm:text-sm">
                    {camera.demographics_config.save_interval || 300}s
                  </div>
                </div>
              </div>

              <Link
                href={`/cameras/${cameraId_display}/demographics`}
                className="w-full btn-gradient-secondary px-4 py-2 sm:py-3 rounded-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Edit Configuration</span>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-gray-400 mb-4">
                <Settings className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                No demographics configuration found for this camera
              </p>
              <Link
                href={`/cameras/${cameraId_display}/demographics`}
                className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base"
              >
                Configure Demographics
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
