"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "@/services/api/api";
import { components } from "@/services/api/types";
import { X, Save, RotateCcw } from "lucide-react";
import { cameraUpdateSchema } from "@/services/schema/camera-update.schema";

type CameraDetail = components["schemas"]["CameraDetail"];

interface CameraEditFormProps {
  camera: CameraDetail;
  onCancel: () => void;
}

export function CameraEditForm({ camera, onCancel }: CameraEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(cameraUpdateSchema),
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width,
      stream_frame_height: camera.stream_frame_height,
      stream_max_length: camera.stream_max_length,
      stream_quality: camera.stream_quality,
      stream_fps: camera.stream_fps,
      stream_skip_frames: camera.stream_skip_frames,
    },
  });

  const updateCameraMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: updatedCamera, error } = await api.PUT(
        "/cameras/{camera_id}",
        {
          params: { path: { camera_id: camera.id } },
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      return updatedCamera;
    },
    onSuccess: (updatedCamera) => {
      queryClient.setQueryData(["camera", camera.id], updatedCamera);
      queryClient.invalidateQueries({ queryKey: ["cameras"] });

      enqueueSnackbar("Camera updated successfully!", {
        variant: "success",
      });
      onCancel();
    },
    onError: (error: unknown) => {
      console.error("Failed to update camera:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { detail?: Array<{ msg?: string }> } })?.data
              ?.detail?.[0]?.msg || "Failed to update camera"
          : "Failed to update camera";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    updateCameraMutation.mutate(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Edit Stream Setting
        </h2>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Reset form"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Cancel editing"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Camera Name *
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter camera name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              RTSP URL *
            </label>
            <input
              {...register("rtsp_url")}
              type="url"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rtsp_url ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="rtsp://example.com/stream"
              disabled={isSubmitting}
            />
            {errors.rtsp_url && (
              <p className="mt-1 text-sm text-red-400">
                {errors.rtsp_url.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-2">
            Stream Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frame Width (px)
              </label>
              <input
                {...register("stream_frame_width")}
                type="number"
                min="1"
                max="2560"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_frame_width
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                placeholder="1920"
                disabled={isSubmitting}
              />
              {errors.stream_frame_width && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_frame_width.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frame Height (px)
              </label>
              <input
                {...register("stream_frame_height")}
                type="number"
                min="1"
                max="2560"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_frame_height
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                placeholder="1080"
                disabled={isSubmitting}
              />
              {errors.stream_frame_height && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_frame_height.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Length (frames)
              </label>
              <input
                {...register("stream_max_length")}
                type="number"
                min="0"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_max_length
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                placeholder="0 (unlimited)"
                disabled={isSubmitting}
              />
              {errors.stream_max_length && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_max_length.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quality (%)
              </label>
              <input
                {...register("stream_quality")}
                type="number"
                min="80"
                max="100"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_quality ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="90"
                disabled={isSubmitting}
              />
              {errors.stream_quality && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_quality.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                FPS
              </label>
              <input
                {...register("stream_fps")}
                type="number"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_fps ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="30"
                disabled={isSubmitting}
              />
              {errors.stream_fps && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_fps.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skip Frames
              </label>
              <input
                {...register("stream_skip_frames")}
                type="number"
                min="0"
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stream_skip_frames
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
                placeholder="0"
                disabled={isSubmitting}
              />
              {errors.stream_skip_frames && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.stream_skip_frames.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
