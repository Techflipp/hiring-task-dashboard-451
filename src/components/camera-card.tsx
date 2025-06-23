import Link from "next/link"
import type { Camera } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CameraIcon, Settings, BarChart3 } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface CameraCardProps {
  camera: Camera
}

export function CameraCard({ camera }: CameraCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <CameraIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{camera.name}</CardTitle>
          </div>
          {camera.demographics_config && (
            <Badge variant="secondary" className="text-xs">
              Analytics Enabled
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">{camera.rtsp_url}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <p className="font-medium">
              {camera.stream_frame_width && camera.stream_frame_height
                ? `${camera.stream_frame_width}x${camera.stream_frame_height}`
                : "Not set"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">FPS:</span>
            <p className="font-medium">{camera.stream_fps || "Not set"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Quality:</span>
            <p className="font-medium">{camera.stream_quality ? `${camera.stream_quality}%` : "Not set"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Updated:</span>
            <p className="font-medium">{formatDate(camera.updated_at)}</p>
          </div>
        </div>

        {camera.tags && camera.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {camera.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link href={`/cameras/${camera.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </Link>
          {camera.demographics_config && (
            <Link href={`/analytics?camera_id=${camera.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
