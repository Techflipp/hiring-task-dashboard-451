"use client";

import { useRouter, useParams } from "next/navigation";
import { api } from "@/services/api/api";
import { format } from "date-fns";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CameraDetailSkeleton } from "@/components/skeletons/camera-detail.skelton";
import { CameraEditForm } from "@/components/camera-edit-form";
import { useState } from "react";
import { Edit3, ArrowLeft } from "lucide-react";

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params?.id as string;
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: camera,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: async () => {
      const { data, error } = await api.GET("/cameras/{camera_id}", {
        params: { path: { camera_id: cameraId } },
      });

      if (error) {
        enqueueSnackbar("Failed to load camera details.", {
          variant: "error",
        });
        throw error;
      }

      return data;
    },
    enabled: !!cameraId,
  });

  if (isLoading) {
    return <CameraDetailSkeleton />;
  }

  if (error || !camera) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="text-xl mb-4">Camera not found.</p>
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => router.push("/cameras")}
        >
          Back to Cameras
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Details
            </button>
          </div>
          <CameraEditForm
            camera={camera}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src={camera.snapshot}
              alt="Camera Snapshot"
              width={160}
              height={112}
              className="w-40 h-28 object-cover rounded-lg border border-gray-700 bg-gray-800"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                {camera.name}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold shadow ml-2 ${
                    camera.is_active
                      ? "bg-green-400/20 text-green-300 border border-green-400"
                      : "bg-red-400/20 text-red-300 border border-red-400"
                  }`}
                >
                  {camera.is_active ? "Active" : "Inactive"}
                </span>
              </h1>
              <p className="text-gray-400 text-sm mb-1">ID: {camera.id}</p>
              <p className="text-gray-400 text-sm mb-1">
                RTSP URL:{" "}
                <span className="text-blue-300 break-all">
                  {camera.rtsp_url}
                </span>
              </p>
              <p className="text-gray-400 text-sm">
                Status: {camera.status_message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={16} />
            Edit Camera
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Stream Settings
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Frame Width: </span>
                  <span className="text-white">
                    {camera.stream_frame_width}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Frame Height: </span>
                  <span className="text-white">
                    {camera.stream_frame_height}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Max Length: </span>
                  <span className="text-white">{camera.stream_max_length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Quality: </span>
                  <span className="text-white">{camera.stream_quality}</span>
                </div>
                <div>
                  <span className="text-gray-400">FPS: </span>
                  <span className="text-white">{camera.stream_fps}</span>
                </div>
                <div>
                  <span className="text-gray-400">Skip Frames: </span>
                  <span className="text-white">
                    {camera.stream_skip_frames}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {camera.tags.length > 0 ? (
                  camera.tags.map(
                    (tag: { id: string; name: string; color: string }) => (
                      <span
                        key={tag.id}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: tag.color + "33",
                          color: tag.color,
                          border: `1px solid ${tag.color}55`,
                        }}
                      >
                        {tag.name}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-gray-400">No tags</span>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Timestamps
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 text-sm">Created At: </span>
                  <span className="text-white">
                    {format(new Date(camera.created_at), "PPpp")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Updated At: </span>
                  <span className="text-white">
                    {format(new Date(camera.updated_at), "PPpp")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Demographics Config
              </h2>
              {camera.demographics_config ? (
                <div className="space-y-2 text-sm text-white">
                  <div>
                    <span className="text-gray-400">
                      Track History Max Length:{" "}
                    </span>
                    {camera.demographics_config.track_history_max_length ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Exit Threshold: </span>
                    {camera.demographics_config.exit_threshold ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Min Track Duration: </span>
                    {camera.demographics_config.min_track_duration ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">
                      Detection Confidence Threshold:{" "}
                    </span>
                    {camera.demographics_config
                      .detection_confidence_threshold ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">
                      Demographics Confidence Threshold:{" "}
                    </span>
                    {camera.demographics_config
                      .demographics_confidence_threshold ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Min Track Updates: </span>
                    {camera.demographics_config.min_track_updates ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Box Area Threshold: </span>
                    {camera.demographics_config.box_area_threshold ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Save Interval: </span>
                    {camera.demographics_config.save_interval ?? "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">Frame Skip Interval: </span>
                    {camera.demographics_config.frame_skip_interval ?? "—"}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400">
                  No demographics config available.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
