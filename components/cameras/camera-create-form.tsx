"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function CameraCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const selectedTags = (tags || []).filter((tag: any) => formData.tags.includes(tag.id))

      const newCamera = {
        id: `cam-${Date.now()}`,
        name: formData.name,
        rtsp_url: formData.rtsp_url,
        stream_frame_width: formData.stream_frame_width,
        stream_frame_height: formData.stream_frame_height,
        stream_max_length: formData.stream_max_length,
        stream_quality: formData.stream_quality,
        stream_fps: formData.stream_fps,
        stream_skip_frames: formData.stream_skip_frames,
        tags: selectedTags,
        demographics_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const existingCameras = JSON.parse(localStorage.getItem("dummyCameras") || "[]")
      existingCameras.push(newCamera)
      localStorage.setItem("dummyCameras", JSON.stringify(existingCameras))

      queryClient.invalidateQueries({ queryKey: ["cameras"] })

      toast({
        title: "✅ Camera Created Successfully!",
        description: `Camera "${formData.name}" has been added to your system.`,
      })

      router.push(`/cameras/${newCamera.id}`)
    } catch (error: any) {
      toast({
        title: "❌ Creation Failed",
        description: error.message || "Failed to create camera. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Link
          href="/cameras"
          className="p-2 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Create New Camera</h1>
          <p className="text-xs sm:text-sm text-gray-600">Add a new camera to your system</p>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    formData.tags.includes(tag.id)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 text-gray-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  Selected tags: {formData.tags.map((tagId) => tags.find((t: any) => t.id === tagId)?.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-gradient px-6 py-3 rounded-xl flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Creating Camera...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Camera</span>
              </>
            )}
          </Button>

          <Link
            href="/cameras"
            className={`px-6 py-3 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200 text-center text-sm sm:text-base font-medium text-gray-700 ${
              isSubmitting ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
