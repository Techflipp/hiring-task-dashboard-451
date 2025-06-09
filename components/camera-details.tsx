"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Edit, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCameraById } from "@/lib/cameras"
import type { Camera } from "@/lib/types"

interface CameraDetailsProps {
  cameraId: string
  initialData?: Camera
}

export default function CameraDetails({ cameraId, initialData }: CameraDetailsProps) {
  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => getCameraById(cameraId),
    initialData,
  })

  if (isLoading && !initialData) {
    return <div className="animate-pulse">Loading camera details...</div>
  }

  if (error) {
    return <div className="text-red-500">Error loading camera details</div>
  }

  if (!camera) {
    return <div>Camera not found</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{camera.name}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/cameras/${cameraId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Camera
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/demographics/config/${cameraId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Demographics Config
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Camera Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Camera ID:</span>
                  <p className="font-mono">{camera.id}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">RTSP URL:</span>
                  <p className="font-mono break-all">{camera.rtsp_url}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {camera.tags?.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                    {(!camera.tags || camera.tags.length === 0) && (
                      <span className="text-muted-foreground text-sm">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Stream Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Resolution:</span>
                  <p>
                    {camera.stream_frame_width}x{camera.stream_frame_height}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">FPS:</span>
                  <p>{camera.stream_fps}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Quality:</span>
                  <p>{camera.stream_quality}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Max Length:</span>
                  <p>{camera.stream_max_length}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Skip Frames:</span>
                  <p>{camera.stream_skip_frames}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold mb-2">Demographics Configuration</h3>
            {camera.demographics_config ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Track History Max Length:</span>
                  <p>{camera.demographics_config.track_history_max_length}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Exit Threshold:</span>
                  <p>{camera.demographics_config.exit_threshold}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Min Track Duration:</span>
                  <p>{camera.demographics_config.min_track_duration}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Detection Confidence:</span>
                  <p>{camera.demographics_config.detection_confidence_threshold}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Demographics Confidence:</span>
                  <p>{camera.demographics_config.demographics_confidence_threshold}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Min Track Updates:</span>
                  <p>{camera.demographics_config.min_track_updates}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Box Area Threshold:</span>
                  <p>{camera.demographics_config.box_area_threshold}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Save Interval:</span>
                  <p>{camera.demographics_config.save_interval}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Frame Skip Interval:</span>
                  <p>{camera.demographics_config.frame_skip_interval}</p>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-muted-foreground">No demographics configuration found.</p>
                <Button asChild className="mt-2">
                  <Link href={`/demographics/config/${cameraId}`}>Create Configuration</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
