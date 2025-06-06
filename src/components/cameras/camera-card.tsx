import { Camera } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Settings, BarChart3, Eye } from "lucide-react";
import Link from "next/link";

interface CameraCardProps {
  camera: Camera;
}

export function CameraCard({ camera }: CameraCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/cameras/${camera.id}`}>
        <CardHeader className="cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <Video className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <CardTitle className="text-lg hover:text-blue-600 transition-colors truncate">
                {camera.name}
              </CardTitle>
            </div>
            <Eye className="h-4 w-4 text-gray-400 flex-shrink-0" />
          </div>
        </CardHeader>
      </Link>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-600">RTSP URL:</span>
            <p className="text-gray-800 truncate text-xs sm:text-sm">
              {camera.rtsp_url}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {camera.stream_frame_width && camera.stream_frame_height && (
              <div>
                <span className="font-medium text-gray-600 text-xs">
                  Resolution:
                </span>
                <p className="text-gray-800 text-sm">
                  {camera.stream_frame_width}x{camera.stream_frame_height}
                </p>
              </div>
            )}
            {camera.stream_fps && (
              <div>
                <span className="font-medium text-gray-600 text-xs">FPS:</span>
                <p className="text-gray-800 text-sm">{camera.stream_fps}</p>
              </div>
            )}
          </div>

          {camera.tags && camera.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {camera.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                camera.demographics_config
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {camera.demographics_config ? "Configured" : "Not Configured"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href={`/cameras/${camera.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full whitespace-nowrap">
                <Eye className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">View</span>
                <span className="sm:hidden">Details</span>
              </Button>
            </Link>
            <Link href={`/cameras/${camera.id}/edit`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Link
              href={`/demographics?camera_id=${camera.id}`}
              className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="inline">Demographics</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
