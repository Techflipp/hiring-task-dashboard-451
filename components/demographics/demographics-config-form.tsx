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

interface DemographicsConfigFormProps {
  cameraId: string
}

export function DemographicsConfigForm({ cameraId }: DemographicsConfigFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: camera, isLoading } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => apiClient.getCamera(cameraId),
  })

  const [formData, setFormData] = useState({
    track_history_max_length: 50,
    exit_threshold: 30,
    min_track_duration: 5,
    detection_confidence_threshold: 0.6,
    demographics_confidence_threshold: 0.6,
    min_track_updates: 5,
    box_area_threshold: 0.1,
    save_interval: 300,
    frame_skip_interval: 1.0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (camera?.demographics_config) {
      setFormData({
        track_history_max_length: camera.demographics_config.track_history_max_length || 50,
        exit_threshold: camera.demographics_config.exit_threshold || 30,
        min_track_duration: camera.demographics_config.min_track_duration || 5,
        detection_confidence_threshold: camera.demographics_config.detection_confidence_threshold || 0.6,
        demographics_confidence_threshold: camera.demographics_config.demographics_confidence_threshold || 0.6,
        min_track_updates: camera.demographics_config.min_track_updates || 5,
        box_area_threshold: camera.demographics_config.box_area_threshold || 0.1,
        save_interval: camera.demographics_config.save_interval || 300,
        frame_skip_interval: camera.demographics_config.frame_skip_interval || 1.0,
      })
    }
  }, [camera])

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.createDemographicsConfig({ ...data, camera_id: cameraId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast({
        title: "Success",
        description: "Demographics configuration created successfully",
      })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create demographics configuration",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiClient.updateDemographicsConfig(camera.demographics_config.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast({
        title: "Success",
        description: "Demographics configuration updated successfully",
      })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update demographics configuration",
        variant: "destructive",
      })
    },
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.track_history_max_length < 1 || formData.track_history_max_length > 100) {
      newErrors.track_history_max_length = "Track history max length must be between 1 and 100"
    }

    if (formData.exit_threshold < 1 || formData.exit_threshold > 300) {
      newErrors.exit_threshold = "Exit threshold must be between 1 and 300"
    }

    if (formData.min_track_duration < 1 || formData.min_track_duration > 60) {
      newErrors.min_track_duration = "Min track duration must be between 1 and 60"
    }

    if (formData.detection_confidence_threshold < 0.1 || formData.detection_confidence_threshold > 1.0) {
      newErrors.detection_confidence_threshold = "Detection confidence threshold must be between 0.1 and 1.0"
    }

    if (formData.demographics_confidence_threshold < 0.1 || formData.demographics_confidence_threshold > 1.0) {
      newErrors.demographics_confidence_threshold = "Demographics confidence threshold must be between 0.1 and 1.0"
    }

    if (formData.min_track_updates < 1 || formData.min_track_updates > 100) {
      newErrors.min_track_updates = "Min track updates must be between 1 and 100"
    }

    if (formData.box_area_threshold < 0.05 || formData.box_area_threshold > 1.0) {
      newErrors.box_area_threshold = "Box area threshold must be between 0.05 and 1.0"
    }

    if (formData.save_interval < 300 || formData.save_interval > 1800) {
      newErrors.save_interval = "Save interval must be between 300 and 1800"
    }

    if (formData.frame_skip_interval < 0.1 || formData.frame_skip_interval > 5.0) {
      newErrors.frame_skip_interval = "Frame skip interval must be between 0.1 and 5.0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (camera?.demographics_config) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!camera) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8 text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Camera not found</h3>
        <Link href="/cameras" className="btn-gradient px-4 py-2 rounded-xl text-sm">
          Back to Cameras
        </Link>
      </div>
    )
  }

  const isEditing = !!camera.demographics_config

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">
            {isEditing ? "Edit" : "Create"} Demographics Configuration
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Configure demographics detection settings for {camera.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Detection Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="detection_confidence_threshold" className="text-sm font-medium text-gray-700">
                Detection Confidence (0.1-1.0)
              </Label>
              <Input
                id="detection_confidence_threshold"
                type="number"
                step="0.01"
                min="0.1"
                max="1.0"
                value={formData.detection_confidence_threshold}
                onChange={(e) => handleInputChange("detection_confidence_threshold", Number.parseFloat(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.detection_confidence_threshold ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.detection_confidence_threshold && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.detection_confidence_threshold}</p>
              )}
            </div>

            <div>
              <Label htmlFor="demographics_confidence_threshold" className="text-sm font-medium text-gray-700">
                Demographics Confidence (0.1-1.0)
              </Label>
              <Input
                id="demographics_confidence_threshold"
                type="number"
                step="0.01"
                min="0.1"
                max="1.0"
                value={formData.demographics_confidence_threshold}
                onChange={(e) =>
                  handleInputChange("demographics_confidence_threshold", Number.parseFloat(e.target.value))
                }
                className={`mt-1 text-sm sm:text-base ${errors.demographics_confidence_threshold ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.demographics_confidence_threshold && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.demographics_confidence_threshold}</p>
              )}
            </div>

            <div>
              <Label htmlFor="box_area_threshold" className="text-sm font-medium text-gray-700">
                Box Area Threshold (0.05-1.0)
              </Label>
              <Input
                id="box_area_threshold"
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                value={formData.box_area_threshold}
                onChange={(e) => handleInputChange("box_area_threshold", Number.parseFloat(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.box_area_threshold ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.box_area_threshold && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.box_area_threshold}</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tracking Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="track_history_max_length" className="text-sm font-medium text-gray-700">
                Track History Max Length (1-100)
              </Label>
              <Input
                id="track_history_max_length"
                type="number"
                min="1"
                max="100"
                value={formData.track_history_max_length}
                onChange={(e) => handleInputChange("track_history_max_length", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.track_history_max_length ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.track_history_max_length && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.track_history_max_length}</p>
              )}
            </div>

            <div>
              <Label htmlFor="exit_threshold" className="text-sm font-medium text-gray-700">
                Exit Threshold (1-300 seconds)
              </Label>
              <Input
                id="exit_threshold"
                type="number"
                min="1"
                max="300"
                value={formData.exit_threshold}
                onChange={(e) => handleInputChange("exit_threshold", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.exit_threshold ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.exit_threshold && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.exit_threshold}</p>}
            </div>

            <div>
              <Label htmlFor="min_track_duration" className="text-sm font-medium text-gray-700">
                Min Track Duration (1-60 seconds)
              </Label>
              <Input
                id="min_track_duration"
                type="number"
                min="1"
                max="60"
                value={formData.min_track_duration}
                onChange={(e) => handleInputChange("min_track_duration", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.min_track_duration ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.min_track_duration && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.min_track_duration}</p>
              )}
            </div>

            <div>
              <Label htmlFor="min_track_updates" className="text-sm font-medium text-gray-700">
                Min Track Updates (1-100)
              </Label>
              <Input
                id="min_track_updates"
                type="number"
                min="1"
                max="100"
                value={formData.min_track_updates}
                onChange={(e) => handleInputChange("min_track_updates", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.min_track_updates ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.min_track_updates && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.min_track_updates}</p>
              )}
            </div>

            <div>
              <Label htmlFor="save_interval" className="text-sm font-medium text-gray-700">
                Save Interval (300-1800 seconds)
              </Label>
              <Input
                id="save_interval"
                type="number"
                min="300"
                max="1800"
                value={formData.save_interval}
                onChange={(e) => handleInputChange("save_interval", Number.parseInt(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.save_interval ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.save_interval && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.save_interval}</p>}
            </div>

            <div>
              <Label htmlFor="frame_skip_interval" className="text-sm font-medium text-gray-700">
                Frame Skip Interval (0.1-5.0)
              </Label>
              <Input
                id="frame_skip_interval"
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={formData.frame_skip_interval}
                onChange={(e) => handleInputChange("frame_skip_interval", Number.parseFloat(e.target.value))}
                className={`mt-1 text-sm sm:text-base ${errors.frame_skip_interval ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
              />
              {errors.frame_skip_interval && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.frame_skip_interval}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="btn-gradient px-6 py-3 rounded-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span>
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Update Configuration"
                  : "Create Configuration"}
            </span>
          </Button>

          <Link
            href={`/cameras/${cameraId}`}
            className="px-6 py-3 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200 text-center text-sm sm:text-base font-medium text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
