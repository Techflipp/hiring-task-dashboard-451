"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { getCameraById, updateCamera, getTags } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CameraEditFormProps {
  cameraId: string
}

interface Tag {
  id: string
  name: string
  color?: string
}

interface Camera {
  id: string
  name: string
  rtsp_url: string
  stream_frame_width?: number
  stream_frame_height?: number
  stream_max_length?: number
  stream_quality?: number
  stream_fps?: number
  stream_skip_frames?: number
  tags?: (string | Tag)[]
}

export default function CameraEditForm({ cameraId }: CameraEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [camera, setCamera] = useState<Camera | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    rtsp_url: "",
    stream_frame_width: "",
    stream_frame_height: "",
    stream_max_length: "",
    stream_quality: "",
    stream_fps: "",
    stream_skip_frames: "",
    tags: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCamera()
    fetchTags()
  }, [cameraId])

  const fetchCamera = async () => {
    try {
      const response = await getCameraById(cameraId)
      setCamera(response)
      setFormData({
        name: response.name || "",
        rtsp_url: response.rtsp_url || "",
        stream_frame_width: response.stream_frame_width?.toString() || "",
        stream_frame_height: response.stream_frame_height?.toString() || "",
        stream_max_length: response.stream_max_length?.toString() || "",
        stream_quality: response.stream_quality?.toString() || "",
        stream_fps: response.stream_fps?.toString() || "",
        stream_skip_frames: response.stream_skip_frames?.toString() || "",
        tags: response.tags?.map((tag: any) => (typeof tag === "object" ? tag.id : tag)) || [],
      })
    } catch (error) {
      console.error("Failed to fetch camera:", error)
      toast({
        title: "Error",
        description: "Failed to load camera details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const tags = await getTags()
      setAvailableTags(tags)
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Camera name is required"
    }

    if (!formData.rtsp_url.trim()) {
      newErrors.rtsp_url = "RTSP URL is required"
    }

    if (formData.stream_frame_width) {
      const width = Number.parseInt(formData.stream_frame_width)
      if (isNaN(width) || width < 1 || width > 2560) {
        newErrors.stream_frame_width = "Width must be between 1 and 2560"
      }
    }

    if (formData.stream_frame_height) {
      const height = Number.parseInt(formData.stream_frame_height)
      if (isNaN(height) || height < 1 || height > 2560) {
        newErrors.stream_frame_height = "Height must be between 1 and 2560"
      }
    }

    if (formData.stream_quality) {
      const quality = Number.parseInt(formData.stream_quality)
      if (isNaN(quality) || quality < 80 || quality > 100) {
        newErrors.stream_quality = "Quality must be between 80 and 100"
      }
    }

    if (formData.stream_fps) {
      const fps = Number.parseInt(formData.stream_fps)
      if (isNaN(fps) || fps < 1 || fps > 120) {
        newErrors.stream_fps = "FPS must be between 1 and 120"
      }
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
      const updateData: any = {
        name: formData.name,
        rtsp_url: formData.rtsp_url,
        tags: formData.tags,
      }

      if (formData.stream_frame_width) {
        updateData.stream_frame_width = Number.parseInt(formData.stream_frame_width)
      }
      if (formData.stream_frame_height) {
        updateData.stream_frame_height = Number.parseInt(formData.stream_frame_height)
      }
      if (formData.stream_max_length) {
        updateData.stream_max_length = Number.parseInt(formData.stream_max_length)
      }
      if (formData.stream_quality) {
        updateData.stream_quality = Number.parseInt(formData.stream_quality)
      }
      if (formData.stream_fps) {
        updateData.stream_fps = Number.parseInt(formData.stream_fps)
      }
      if (formData.stream_skip_frames) {
        updateData.stream_skip_frames = Number.parseInt(formData.stream_skip_frames)
      }

      await updateCamera(cameraId, updateData)

      toast({
        title: "Success",
        description: "Camera updated successfully",
      })

      router.push(`/cameras/${cameraId}`)
    } catch (error) {
      console.error("Failed to update camera:", error)
      toast({
        title: "Error",
        description: "Failed to update camera",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading camera details...</div>
  }

  if (!camera) {
    return <div>Camera not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit {camera.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Camera Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Camera Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtsp_url">RTSP URL *</Label>
                <Input
                  id="rtsp_url"
                  value={formData.rtsp_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rtsp_url: e.target.value }))}
                  className={errors.rtsp_url ? "border-red-500" : ""}
                />
                {errors.rtsp_url && <p className="text-sm text-red-500">{errors.rtsp_url}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stream_frame_width">Frame Width (1-2560)</Label>
                <Input
                  id="stream_frame_width"
                  type="number"
                  min="1"
                  max="2560"
                  value={formData.stream_frame_width}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stream_frame_width: e.target.value }))}
                  className={errors.stream_frame_width ? "border-red-500" : ""}
                />
                {errors.stream_frame_width && <p className="text-sm text-red-500">{errors.stream_frame_width}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream_frame_height">Frame Height (1-2560)</Label>
                <Input
                  id="stream_frame_height"
                  type="number"
                  min="1"
                  max="2560"
                  value={formData.stream_frame_height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stream_frame_height: e.target.value }))}
                  className={errors.stream_frame_height ? "border-red-500" : ""}
                />
                {errors.stream_frame_height && <p className="text-sm text-red-500">{errors.stream_frame_height}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="stream_quality">Quality (80-100)</Label>
                <Input
                  id="stream_quality"
                  type="number"
                  min="80"
                  max="100"
                  value={formData.stream_quality}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stream_quality: e.target.value }))}
                  className={errors.stream_quality ? "border-red-500" : ""}
                />
                {errors.stream_quality && <p className="text-sm text-red-500">{errors.stream_quality}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream_fps">FPS (1-120)</Label>
                <Input
                  id="stream_fps"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.stream_fps}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stream_fps: e.target.value }))}
                  className={errors.stream_fps ? "border-red-500" : ""}
                />
                {errors.stream_fps && <p className="text-sm text-red-500">{errors.stream_fps}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream_max_length">Max Length (0-10000)</Label>
                <Input
                  id="stream_max_length"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.stream_max_length}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stream_max_length: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
