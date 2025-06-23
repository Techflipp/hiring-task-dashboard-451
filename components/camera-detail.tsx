"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Settings, BarChart3, ArrowLeft } from "lucide-react"
import { getCameraById } from "@/lib/api"
import DemographicsConfigForm from "./demographics-config-form"

interface Tag {
  id: string
  name: string
  color?: string
}

interface CameraDetailProps {
  cameraId: string
}

interface CameraType {
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
  demographics_config?: any
}

export default function CameraDetail({ cameraId }: CameraDetailProps) {
  const router = useRouter()
  const [camera, setCamera] = useState<CameraType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfigForm, setShowConfigForm] = useState(false)

  useEffect(() => {
    fetchCamera()
  }, [cameraId])

  const fetchCamera = async () => {
    try {
      setLoading(true)
      const response = await getCameraById(cameraId)
      setCamera(response)
    } catch (error) {
      console.error("Failed to fetch camera:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Camera className="h-8 w-8" />
            {camera.name}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Camera Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">RTSP URL</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{camera.rtsp_url}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Resolution</label>
                <p>
                  {camera.stream_frame_width}x{camera.stream_frame_height}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">FPS</label>
                <p>{camera.stream_fps || "Not set"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Quality</label>
                <p>{camera.stream_quality || "Not set"}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Max Length</label>
                <p>{camera.stream_max_length || "Not set"}s</p>
              </div>
            </div>

            {camera.tags && camera.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {camera.tags.map((tag) => (
                    <Badge key={typeof tag === "object" ? tag.id : tag} variant="secondary">
                      {typeof tag === "object" ? tag.name : tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Demographics Configuration
              {camera.demographics_config && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Configured
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {camera.demographics_config ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">Track History Max</label>
                    <p>{camera.demographics_config.track_history_max_length}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Exit Threshold</label>
                    <p>{camera.demographics_config.exit_threshold}s</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Min Track Duration</label>
                    <p>{camera.demographics_config.min_track_duration}s</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Detection Confidence</label>
                    <p>{camera.demographics_config.detection_confidence_threshold}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowConfigForm(true)} className="w-full">
                  Edit Configuration
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No demographics configuration found for this camera.</p>
                <Button onClick={() => setShowConfigForm(true)}>Create Configuration</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push(`/cameras/${camera.id}/edit`)}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Camera
        </Button>
        {camera.demographics_config && (
          <Button variant="outline" onClick={() => router.push(`/demographics/${camera.id}`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        )}
      </div>

      {showConfigForm && (
        <DemographicsConfigForm
          cameraId={camera.id}
          existingConfig={camera.demographics_config}
          onClose={() => setShowConfigForm(false)}
          onSuccess={() => {
            setShowConfigForm(false)
            fetchCamera()
          }}
        />
      )}
    </div>
  )
}
