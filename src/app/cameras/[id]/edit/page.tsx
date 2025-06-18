"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cameraApi, tagsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const cameraSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rtsp_url: z.string().url("Must be a valid URL"),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

type CameraFormData = z.infer<typeof cameraSchema>;

export default function CameraEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cameraId = params.id as string;

  const { data: camera, isLoading: isLoadingCamera } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => cameraApi.getCamera(cameraId),
    enabled: !!cameraId,
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagsApi.getTags(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: camera?.name || "",
      rtsp_url: camera?.rtsp_url || "",
      stream_frame_width: camera?.stream_frame_width,
      stream_frame_height: camera?.stream_frame_height,
      stream_max_length: camera?.stream_max_length,
      stream_quality: camera?.stream_quality,
      stream_fps: camera?.stream_fps,
      stream_skip_frames: camera?.stream_skip_frames,
      tags: camera?.tags?.map((tag) => tag.id) || [],
    },
  });

  const updateCameraMutation = useMutation({
    mutationFn: (data: CameraFormData) =>
      cameraApi.updateCamera(cameraId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] });
      router.push(`/cameras/${cameraId}`);
    },
  });

  const onSubmit = (data: CameraFormData) => {
    updateCameraMutation.mutate(data);
  };

  if (isLoadingCamera || isLoadingTags) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Camera Not Found
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Camera</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Camera Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Camera name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rtsp_url">RTSP URL *</Label>
                <Input
                  id="rtsp_url"
                  {...register("rtsp_url")}
                  placeholder="rtsp://example.com/stream"
                />
                {errors.rtsp_url && (
                  <p className="text-sm text-red-600">
                    {errors.rtsp_url.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream_frame_width">Frame Width</Label>
                  <Input
                    id="stream_frame_width"
                    type="number"
                    {...register("stream_frame_width", { valueAsNumber: true })}
                    placeholder="1920"
                    min="1"
                    max="2560"
                  />
                  {errors.stream_frame_width && (
                    <p className="text-sm text-red-600">
                      {errors.stream_frame_width.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream_frame_height">Frame Height</Label>
                  <Input
                    id="stream_frame_height"
                    type="number"
                    {...register("stream_frame_height", {
                      valueAsNumber: true,
                    })}
                    placeholder="1080"
                    min="1"
                    max="2560"
                  />
                  {errors.stream_frame_height && (
                    <p className="text-sm text-red-600">
                      {errors.stream_frame_height.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream_fps">Frame Rate (FPS)</Label>
                  <Input
                    id="stream_fps"
                    type="number"
                    {...register("stream_fps", { valueAsNumber: true })}
                    placeholder="30"
                    min="1"
                    max="120"
                  />
                  {errors.stream_fps && (
                    <p className="text-sm text-red-600">
                      {errors.stream_fps.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream_quality">Quality (%)</Label>
                  <Input
                    id="stream_quality"
                    type="number"
                    {...register("stream_quality", { valueAsNumber: true })}
                    placeholder="90"
                    min="80"
                    max="100"
                  />
                  {errors.stream_quality && (
                    <p className="text-sm text-red-600">
                      {errors.stream_quality.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream_max_length">
                    Max Length (seconds)
                  </Label>
                  <Input
                    id="stream_max_length"
                    type="number"
                    {...register("stream_max_length", { valueAsNumber: true })}
                    placeholder="3600"
                    min="0"
                    max="10000"
                  />
                  {errors.stream_max_length && (
                    <p className="text-sm text-red-600">
                      {errors.stream_max_length.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream_skip_frames">Skip Frames</Label>
                  <Input
                    id="stream_skip_frames"
                    type="number"
                    {...register("stream_skip_frames", { valueAsNumber: true })}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  {errors.stream_skip_frames && (
                    <p className="text-sm text-red-600">
                      {errors.stream_skip_frames.message}
                    </p>
                  )}
                </div>
              </div>

              {tags && (
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={tag.id}
                          {...register("tags")}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1">
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
