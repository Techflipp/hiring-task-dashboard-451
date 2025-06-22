"use client"

import Link from "next/link"
import { Camera, Settings, BarChart3, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Camera as CameraType } from "@/types/api"

interface CameraCardProps {
  camera: CameraType
}

export function CameraCard({ camera }: CameraCardProps) {
  const isOnline = !!camera.rtsp_url
  const hasConfig = !!camera.demographics_config

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-white/80 to-white/60">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
              isOnline
                ? "bg-gradient-to-br from-green-500 to-emerald-500"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {isOnline ? (
              <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex space-x-1 sm:space-x-2">
          {hasConfig && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
              Analytics
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
          {camera.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">ID: {camera.id.slice(0, 8)}...</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
        <div className="bg-white/50 rounded-lg p-2 sm:p-3">
          <div className="text-gray-600 mb-1">Resolution</div>
          <div className="font-semibold text-gray-900">
            {camera.stream_frame_width}x{camera.stream_frame_height}
          </div>
        </div>
        <div className="bg-white/50 rounded-lg p-2 sm:p-3">
          <div className="text-gray-600 mb-1">FPS</div>
          <div className="font-semibold text-gray-900">{camera.stream_fps}</div>
        </div>
      </div>

      <div className="flex space-x-2 sm:space-x-3">
        <Link
          href={`/cameras/${camera.id}`}
          className="flex-1 btn-gradient-secondary px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm text-center"
        >
          View Details
        </Link>

        <Link
          href={`/cameras/${camera.id}/edit`}
          className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        </Link>

        {hasConfig && (
          <Link
            href={`/analytics?camera_id=${camera.id}`}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </Link>
        )}
      </div>
    </div>
  )
}
