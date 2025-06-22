"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CameraEditFormProps {
  cameraId: string
}

export function CameraEditForm({ cameraId }: CameraEditFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => apiClient.getCamera(cameraId),
    retry: 1,
  })

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => apiClient.getTags(),
  })

  const [formData, setFormData] = useState({
    name: "",
    rtsp_url: "",
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_max_length: 300,
    stream_quality: 90,
    stream_fps: 30,
    stream_skip_frames: 0,
    tags: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (camera) {
      const cameraTagIds = camera.tags ? camera.tags.map((tag: any) => tag?.id).filter(Boolean) : []

      setFormData({
        name: camera.name || "",
        rtsp_url: camera.rtsp_url || "",
        stream_frame_width: camera.stream_frame_width || 1920,
        stream_frame_height: camera.stream_frame_height || 1080,
        stream_max_length: camera.stream_max_length || 300,
        stream_quality: camera.stream_quality || 90,
        stream_fps: camera.stream_fps || 30,
        stream_skip_frames: camera.stream_skip_frames || 0,
        tags: cameraTagIds,
      })
    }
  }, [camera])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        const selectedTags = (tags || []).filter((tag: any) => data.tags.includes(tag?.id))

        const updateData = {
          ...data,
          tags: selectedTags,
        }

        return await apiClient.updateCamera(cameraId, updateData)
      } catch (error) {
        const localCameras = JSON.parse(localStorage.getItem("dummyCameras") || "[]")
        const cameraIndex = localCameras.findIndex((cam: any) => cam.id === cameraId)

        if (cameraIndex !== -1) {
          const selectedTags = (tags || []).filter((tag: any) => data.tags.includes(tag?.id))

          localCameras[cameraIndex] = {
            ...localCameras[cameraIndex],
            ...data,
            tags: selectedTags,
            updated_at: new Date().toISOString(),
          }
          localStorage.setItem("dummyCameras", JSON.stringify(localCameras))
          return localCameras[cameraIndex]
        }

        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast({
        title: "✅ Camera Updated Successfully!",
        description: `Camera "${formData.name}" has been updated.`,
      })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error: any) => {
      toast({
        title: "❌ Update Failed",
        description: error.message || "Failed to update camera. Please try again.",
        variant: "destructive",
      })
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Camera name is required"
    }

    if (!formData.rtsp_url.trim()) {
      newErrors.rtsp_url = "RTSP URL is required"
    } else if (!formData.rtsp_url.startsWith("rtsp://")) {
      newErrors.rtsp_url = "RTSP URL must start with rtsp://"
    }

    if (formData.stream_frame_width < 1 || formData.stream_frame_width > 2560) {
      newErrors.stream_frame_width = "Width must be between 1 and 2560"
    }

    if (formData.stream_frame_height < 1 || formData.stream_frame_height > 2560) {
      newErrors.stream_frame_height = "Height must be between 1 and 2560"
    }

    if (formData.stream_max_length < 0 || formData.stream_max_length > 10000) {
      newErrors.stream_max_length = "Max length must be between 0 and 10000"
    }

    if (formData.stream_quality < 80 || formData.stream_quality > 100) {
      newErrors.stream_quality = "Quality must be between 80 and 100"
    }

    if (formData.stream_fps < 1 || formData.stream_fps > 120) {
      newErrors.stream_fps = "FPS must be between 1 and 120"
    }

    if (formData.stream_skip_frames < 0 || formData.stream_skip_frames > 100) {
      newErrors.stream_skip_frames = "Skip frames must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    updateMutation.mutate(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId],
    }))
  }

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

  return (
    <div className="space-y-4 sm:space-y-6">

      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link
          href={`/cameras/${cameraId}`}
          className="p-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Edit Camera</h1>
          <p className="text-xs sm:text-sm text-gray-600">Update camera settings and configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Camera Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`mt-1 text-sm sm:text-base ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="Enter camera name"
                disabled={updateMutation.isPending}
              />
              {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="rtsp_url" className="text-sm font-medium text-gray-700">
                RTSP URL *
              </Label>
              <Input
                id="rtsp_url"
                type="url"
                value={formData.rtsp_url}
                onChange={(e) => handleInputChange("rtsp_url", e.target.value)}
                className={`mt-1 text-sm sm:text-base font-mono ${errors.rtsp_url ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="rtsp://username:password@ip:port/stream"
                disabled={updateMutation.isPending}
              />
              {errors.rtsp_url && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.rtsp_url}</p>}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Stream Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="stream_frame_width" className="text-sm font-medium text-gray-700">
                Frame Width (1-2560)
              </Label>
              <Input
                id="stream_frame_width"
                type="number"
                min="1"
                max="2560"
                value={formData.stream_frame_width}
                onChange={(e) => handleInputChange("stream_frame_width", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_frame_width ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_frame_width && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_frame_width}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stream_frame_height" className="text-sm font-medium text-gray-700">
                Frame Height (1-2560)
              </Label>
              <Input
                id="stream_frame_height"
                type="number"
                min="1"
                max="2560"
                value={formData.stream_frame_height}
                onChange={(e) => handleInputChange("stream_frame_height", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_frame_height ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_frame_height && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_frame_height}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stream_fps" className="text-sm font-medium text-gray-700">
                Frame Rate (1-120)
              </Label>
              <Input
                id="stream_fps"
                type="number"
                min="1"
                max="120"
                value={formData.stream_fps}
                onChange={(e) => handleInputChange("stream_fps", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_fps ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_fps && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_fps}</p>}
            </div>

            <div>
              <Label htmlFor="stream_quality" className="text-sm font-medium text-gray-700">
                Quality (80-100)
              </Label>
              <Input
                id="stream_quality"
                type="number"
                min="80"
                max="100"
                value={formData.stream_quality}
                onChange={(e) => handleInputChange("stream_quality", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_quality ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_quality && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_quality}</p>}
            </div>

            <div>
              <Label htmlFor="stream_max_length" className="text-sm font-medium text-gray-700">
                Max Length (0-10000)
              </Label>
              <Input
                id="stream_max_length"
                type="number"
                min="0"
                max="10000"
                value={formData.stream_max_length}
                onChange={(e) => handleInputChange("stream_max_length", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_max_length ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_max_length && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_max_length}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stream_skip_frames" className="text-sm font-medium text-gray-700">
                Skip Frames (0-100)
              </Label>
              <Input
                id="stream_skip_frames"
                type="number"
                min="0"
                max="100"
                value={formData.stream_skip_frames}
                onChange={(e) => handleInputChange("stream_skip_frames", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.stream_skip_frames ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                disabled={updateMutation.isPending}
              />
              {errors.stream_skip_frames && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.stream_skip_frames}</p>
              )}
            </div>
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tags</h2>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tags.map((tag: any) => (
                <button
                  key={tag?.id || Math.random()}
                  type="button"
                  onClick={() => tag?.id && toggleTag(tag.id)}
                  disabled={updateMutation.isPending || !tag?.id}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    tag?.id && formData.tags.includes(tag.id)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 text-gray-700"
                  } ${updateMutation.isPending || !tag?.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {tag?.name || "Unknown Tag"}
                </button>
              ))}
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  Selected tags:{" "}
                  {formData.tags
                    .map((tagId) => tags.find((t: any) => t?.id === tagId)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        )}


        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-gradient px-6 py-3 rounded-xl flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>

          <Link
            href={`/cameras/${cameraId}`}
            className={`px-6 py-3 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200 text-center text-sm sm:text-base font-medium text-gray-700 ${
              updateMutation.isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
