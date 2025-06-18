"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { cameraApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;

  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => cameraApi.getCamera(cameraId),
    enabled: !!cameraId,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Camera
          </h2>
          <p className="text-gray-600 mb-4">
            The camera could not be found or loaded.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!camera) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{camera.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Camera Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Camera Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-lg">{camera.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      RTSP URL
                    </label>
                    <p className="text-sm text-gray-600 break-all">
                      {camera.rtsp_url}
                    </p>
                  </div>
                  {camera.stream_frame_width && camera.stream_frame_height && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Resolution
                      </label>
                      <p className="text-lg">
                        {camera.stream_frame_width} ×{" "}
                        {camera.stream_frame_height}
                      </p>
                    </div>
                  )}
                  {camera.stream_fps && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Frame Rate
                      </label>
                      <p className="text-lg">{camera.stream_fps} FPS</p>
                    </div>
                  )}
                  {camera.stream_quality && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Quality
                      </label>
                      <p className="text-lg">{camera.stream_quality}%</p>
                    </div>
                  )}
                  {camera.stream_max_length && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Max Length
                      </label>
                      <p className="text-lg">{camera.stream_max_length}s</p>
                    </div>
                  )}
                  {camera.stream_skip_frames && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Skip Frames
                      </label>
                      <p className="text-lg">{camera.stream_skip_frames}</p>
                    </div>
                  )}
                </div>

                {camera.tags && camera.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {camera.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demographics Configuration */}
            {camera.demographics_config && (
              <Card>
                <CardHeader>
                  <CardTitle>Demographics Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {camera.demographics_config.track_history_max_length && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Track History Max Length
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.track_history_max_length}
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.exit_threshold && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Exit Threshold
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.exit_threshold}s
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.min_track_duration && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Min Track Duration
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.min_track_duration}s
                        </p>
                      </div>
                    )}
                    {camera.demographics_config
                      .detection_confidence_threshold && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Detection Confidence
                        </label>
                        <p className="text-lg">
                          {(
                            camera.demographics_config
                              .detection_confidence_threshold * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    )}
                    {camera.demographics_config
                      .demographics_confidence_threshold && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Demographics Confidence
                        </label>
                        <p className="text-lg">
                          {(
                            camera.demographics_config
                              .demographics_confidence_threshold * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.min_track_updates && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Min Track Updates
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.min_track_updates}
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.box_area_threshold && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Box Area Threshold
                        </label>
                        <p className="text-lg">
                          {(
                            camera.demographics_config.box_area_threshold * 100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.save_interval && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Save Interval
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.save_interval}s
                        </p>
                      </div>
                    )}
                    {camera.demographics_config.frame_skip_interval && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Frame Skip Interval
                        </label>
                        <p className="text-lg">
                          {camera.demographics_config.frame_skip_interval}s
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/cameras/${camera.id}/edit`} className="w-full">
                  <Button className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Camera
                  </Button>
                </Link>

                {camera.demographics_config ? (
                  <Link
                    href={`/demographics/${camera.demographics_config.id}/edit`}
                    className="w-full">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Demographics Config
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href={`/demographics/new?camera_id=${camera.id}`}
                    className="w-full">
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Demographics
                    </Button>
                  </Link>
                )}

                <Link
                  href={`/analytics?camera_id=${camera.id}`}
                  className="w-full">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
