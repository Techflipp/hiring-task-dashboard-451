"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Save } from "lucide-react"
import { createDemographicsConfig, updateDemographicsConfig } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DemographicsConfigFormProps {
  cameraId: string
  existingConfig?: any
  onClose: () => void
  onSuccess: () => void
}

export default function DemographicsConfigForm({
  cameraId,
  existingConfig,
  onClose,
  onSuccess,
}: DemographicsConfigFormProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    track_history_max_length: existingConfig?.track_history_max_length?.toString() || "50",
    exit_threshold: existingConfig?.exit_threshold?.toString() || "30",
    min_track_duration: existingConfig?.min_track_duration?.toString() || "5",
    detection_confidence_threshold: existingConfig?.detection_confidence_threshold?.toString() || "0.5",
    demographics_confidence_threshold: existingConfig?.demographics_confidence_threshold?.toString() || "0.7",
    min_track_updates: existingConfig?.min_track_updates?.toString() || "10",
    box_area_threshold: existingConfig?.box_area_threshold?.toString() || "0.1",
    save_interval: existingConfig?.save_interval?.toString() || "600",
    frame_skip_interval: existingConfig?.frame_skip_interval?.toString() || "1.0",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const trackHistory = Number.parseInt(formData.track_history_max_length)
    if (isNaN(trackHistory) || trackHistory < 1 || trackHistory > 100) {
      newErrors.track_history_max_length = "Must be between 1 and 100"
    }

    const exitThreshold = Number.parseInt(formData.exit_threshold)
    if (isNaN(exitThreshold) || exitThreshold < 1 || exitThreshold > 300) {
      newErrors.exit_threshold = "Must be between 1 and 300"
    }

    const detectionConfidence = Number.parseFloat(formData.detection_confidence_threshold)
    if (isNaN(detectionConfidence) || detectionConfidence < 0.1 || detectionConfidence > 1.0) {
      newErrors.detection_confidence_threshold = "Must be between 0.1 and 1.0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const configData = {
        camera_id: cameraId,
        track_history_max_length: Number.parseInt(formData.track_history_max_length),
        exit_threshold: Number.parseInt(formData.exit_threshold),
        min_track_duration: Number.parseInt(formData.min_track_duration),
        detection_confidence_threshold: Number.parseFloat(formData.detection_confidence_threshold),
        demographics_confidence_threshold: Number.parseFloat(formData.demographics_confidence_threshold),
        min_track_updates: Number.parseInt(formData.min_track_updates),
        box_area_threshold: Number.parseFloat(formData.box_area_threshold),
        save_interval: Number.parseInt(formData.save_interval),
        frame_skip_interval: Number.parseFloat(formData.frame_skip_interval),
      }

      if (existingConfig) {
        await updateDemographicsConfig(existingConfig.id, configData)
      } else {
        await createDemographicsConfig(configData)
      }

      toast({
        title: "Success",
        description: `Demographics configuration ${existingConfig ? "updated" : "created"} successfully`,
      })

      onSuccess()
    } catch (error) {
      console.error("Failed to save demographics config:", error)
      toast({
        title: "Error",
        description: "Failed to save demographics configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{existingConfig ? "Edit" : "Create"} Demographics Configuration</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="track_history_max_length">Track History Max Length (1-100)</Label>
                <Input
                  id="track_history_max_length"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.track_history_max_length}
                  onChange={(e) => setFormData((prev) => ({ ...prev, track_history_max_length: e.target.value }))}
                  className={errors.track_history_max_length ? "border-red-500" : ""}
                />
                {errors.track_history_max_length && (
                  <p className="text-sm text-red-500">{errors.track_history_max_length}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exit_threshold">Exit Threshold (1-300)</Label>
                <Input
                  id="exit_threshold"
                  type="number"
                  min="1"
                  max="300"
                  value={formData.exit_threshold}
                  onChange={(e) => setFormData((prev) => ({ ...prev, exit_threshold: e.target.value }))}
                  className={errors.exit_threshold ? "border-red-500" : ""}
                />
                {errors.exit_threshold && <p className="text-sm text-red-500">{errors.exit_threshold}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min_track_duration">Min Track Duration (1-60)</Label>
                <Input
                  id="min_track_duration"
                  type="number"
                  min="1"
                  max="60"
                  value={formData.min_track_duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, min_track_duration: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_track_updates">Min Track Updates (1-100)</Label>
                <Input
                  id="min_track_updates"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.min_track_updates}
                  onChange={(e) => setFormData((prev) => ({ ...prev, min_track_updates: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="detection_confidence_threshold">Detection Confidence (0.1-1.0)</Label>
                <Input
                  id="detection_confidence_threshold"
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={formData.detection_confidence_threshold}
                  onChange={(e) => setFormData((prev) => ({ ...prev, detection_confidence_threshold: e.target.value }))}
                  className={errors.detection_confidence_threshold ? "border-red-500" : ""}
                />
                {errors.detection_confidence_threshold && (
                  <p className="text-sm text-red-500">{errors.detection_confidence_threshold}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="demographics_confidence_threshold">Demographics Confidence (0.1-1.0)</Label>
                <Input
                  id="demographics_confidence_threshold"
                  type="number"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={formData.demographics_confidence_threshold}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, demographics_confidence_threshold: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="box_area_threshold">Box Area Threshold (0.05-1.0)</Label>
                <Input
                  id="box_area_threshold"
                  type="number"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={formData.box_area_threshold}
                  onChange={(e) => setFormData((prev) => ({ ...prev, box_area_threshold: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="save_interval">Save Interval (300-1800)</Label>
                <Input
                  id="save_interval"
                  type="number"
                  min="300"
                  max="1800"
                  value={formData.save_interval}
                  onChange={(e) => setFormData((prev) => ({ ...prev, save_interval: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frame_skip_interval">Frame Skip Interval (0.1-5.0)</Label>
              <Input
                id="frame_skip_interval"
                type="number"
                min="0.1"
                max="5.0"
                step="0.1"
                value={formData.frame_skip_interval}
                onChange={(e) => setFormData((prev) => ({ ...prev, frame_skip_interval: e.target.value }))}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : existingConfig ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
