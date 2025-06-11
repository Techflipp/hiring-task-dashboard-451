"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Settings, BarChart3, Camera, Tag, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface CameraDetail {
  id: string
  name: string
  rtsp_url: string
  stream_frame_width?: number
  stream_frame_height?: number
  stream_max_length?: number
  stream_quality?: number
  stream_fps?: number
  stream_skip_frames?: number
  tags: Array<{
    id: string
    name: string
    color: string
  }>
  is_active: boolean
  status_message: string
  snapshot: string
  created_at: string
  updated_at: string
  demographics_config?: {
    id: string
    track_history_max_length: number
    exit_threshold: number
    min_track_duration: number
    detection_confidence_threshold: number
    demographics_confidence_threshold: number
    min_track_updates: number
    box_area_threshold: number
    save_interval: number
    frame_skip_interval: number
  }
}

async function fetchCamera(id: string): Promise<CameraDetail> {
  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/cameras/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch camera")
  }
  return response.json()
}

function CameraDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CameraDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const cameraId = params.id as string

  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => fetchCamera(cameraId),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CameraDetailSkeleton />
      </div>
    )
  }

  if (error || !camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>Failed to load camera details. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cameras">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cameras
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{camera.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {camera.is_active ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">ID: {camera.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/cameras/${camera.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Camera
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/cameras/${camera.id}/demographics`}>
                <Settings className="w-4 h-4 mr-2" />
                Demographics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/analytics?camera_id=${camera.id}`}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={camera.snapshot || "/placeholder.svg"}
                  alt={`${camera.name} snapshot`}
                  className="w-full h-64 object-cover rounded-lg bg-muted"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=256&width=512"
                  }}
                />
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Status:</strong> {camera.status_message}
                  </p>
                  <p>
                    <strong>RTSP URL:</strong> {camera.rtsp_url}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Information */}
          <Card>
            <CardHeader>
              <CardTitle>Camera Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Frame Width:</span>
                  <p className="text-muted-foreground">{camera.stream_frame_width || "Not set"}</p>
                </div>
                <div>
                  <span className="font-medium">Frame Height:</span>
                  <p className="text-muted-foreground">{camera.stream_frame_height || "Not set"}</p>
                </div>
                <div>
                  <span className="font-medium">Max Length:</span>
                  <p className="text-muted-foreground">{camera.stream_max_length || "Not set"}</p>
                </div>
                <div>
                  <span className="font-medium">Quality:</span>
                  <p className="text-muted-foreground">{camera.stream_quality || "Not set"}%</p>
                </div>
                <div>
                  <span className="font-medium">FPS:</span>
                  <p className="text-muted-foreground">{camera.stream_fps || "Not set"}</p>
                </div>
                <div>
                  <span className="font-medium">Skip Frames:</span>
                  <p className="text-muted-foreground">{camera.stream_skip_frames || "Not set"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <span className="font-medium text-sm">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {camera.tags.length > 0 ? (
                    camera.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ backgroundColor: tag.color + "20", color: tag.color }}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No tags assigned</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Created: {new Date(camera.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {new Date(camera.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Configuration */}
        {camera.demographics_config && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Demographics Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Track History Max Length:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.track_history_max_length}</p>
                </div>
                <div>
                  <span className="font-medium">Exit Threshold:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.exit_threshold}s</p>
                </div>
                <div>
                  <span className="font-medium">Min Track Duration:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.min_track_duration}s</p>
                </div>
                <div>
                  <span className="font-medium">Detection Confidence:</span>
                  <p className="text-muted-foreground">
                    {(camera.demographics_config.detection_confidence_threshold * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="font-medium">Demographics Confidence:</span>
                  <p className="text-muted-foreground">
                    {(camera.demographics_config.demographics_confidence_threshold * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="font-medium">Min Track Updates:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.min_track_updates}</p>
                </div>
                <div>
                  <span className="font-medium">Box Area Threshold:</span>
                  <p className="text-muted-foreground">
                    {(camera.demographics_config.box_area_threshold * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="font-medium">Save Interval:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.save_interval}s</p>
                </div>
                <div>
                  <span className="font-medium">Frame Skip Interval:</span>
                  <p className="text-muted-foreground">{camera.demographics_config.frame_skip_interval}s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
