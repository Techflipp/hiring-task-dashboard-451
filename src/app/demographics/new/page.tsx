"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cameraApi, demographicsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Suspense } from "react";

const demographicsSchema = z.object({
  camera_id: z.string().min(1, "Camera is required"),
  track_history_max_length: z.number().min(1).max(100).optional(),
  exit_threshold: z.number().min(1).max(300).optional(),
  min_track_duration: z.number().min(1).max(60).optional(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.number().min(1).max(100).optional(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional(),
  save_interval: z.number().min(300).max(1800).optional(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional(),
});

type DemographicsFormData = z.infer<typeof demographicsSchema>;

function DemographicsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const cameraId = searchParams.get("camera_id");

  const { data: cameras, isLoading: isLoadingCameras } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => cameraApi.getCameras({ page: 1, size: 100 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemographicsFormData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      camera_id: cameraId || "",
    },
  });

  const createDemographicsMutation = useMutation({
    mutationFn: (data: DemographicsFormData) =>
      demographicsApi.createConfig(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      queryClient.invalidateQueries({ queryKey: ["camera", data.camera_id] });
      router.push(`/cameras/${data.camera_id}`);
    },
  });

  const onSubmit = (data: DemographicsFormData) => {
    createDemographicsMutation.mutate(data);
  };

  if (isLoadingCameras) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
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
          <h1 className="text-3xl font-bold text-gray-900">
            New Demographics Configuration
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="camera_id">Camera *</Label>
                <select
                  id="camera_id"
                  {...register("camera_id")}
                  className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select a camera</option>
                  {cameras?.items.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </select>
                {errors.camera_id && (
                  <p className="text-sm text-red-600">
                    {errors.camera_id.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="track_history_max_length">
                    Track History Max Length
                  </Label>
                  <Input
                    id="track_history_max_length"
                    type="number"
                    {...register("track_history_max_length", {
                      valueAsNumber: true,
                    })}
                    placeholder="50"
                    min="1"
                    max="100"
                  />
                  {errors.track_history_max_length && (
                    <p className="text-sm text-red-600">
                      {errors.track_history_max_length.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit_threshold">
                    Exit Threshold (seconds)
                  </Label>
                  <Input
                    id="exit_threshold"
                    type="number"
                    {...register("exit_threshold", { valueAsNumber: true })}
                    placeholder="30"
                    min="1"
                    max="300"
                  />
                  {errors.exit_threshold && (
                    <p className="text-sm text-red-600">
                      {errors.exit_threshold.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_track_duration">
                    Min Track Duration (seconds)
                  </Label>
                  <Input
                    id="min_track_duration"
                    type="number"
                    {...register("min_track_duration", { valueAsNumber: true })}
                    placeholder="5"
                    min="1"
                    max="60"
                  />
                  {errors.min_track_duration && (
                    <p className="text-sm text-red-600">
                      {errors.min_track_duration.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_track_updates">Min Track Updates</Label>
                  <Input
                    id="min_track_updates"
                    type="number"
                    {...register("min_track_updates", { valueAsNumber: true })}
                    placeholder="10"
                    min="1"
                    max="100"
                  />
                  {errors.min_track_updates && (
                    <p className="text-sm text-red-600">
                      {errors.min_track_updates.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detection_confidence_threshold">
                    Detection Confidence Threshold
                  </Label>
                  <Input
                    id="detection_confidence_threshold"
                    type="number"
                    step="0.1"
                    {...register("detection_confidence_threshold", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.8"
                    min="0.1"
                    max="1.0"
                  />
                  {errors.detection_confidence_threshold && (
                    <p className="text-sm text-red-600">
                      {errors.detection_confidence_threshold.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demographics_confidence_threshold">
                    Demographics Confidence Threshold
                  </Label>
                  <Input
                    id="demographics_confidence_threshold"
                    type="number"
                    step="0.1"
                    {...register("demographics_confidence_threshold", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.7"
                    min="0.1"
                    max="1.0"
                  />
                  {errors.demographics_confidence_threshold && (
                    <p className="text-sm text-red-600">
                      {errors.demographics_confidence_threshold.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="box_area_threshold">Box Area Threshold</Label>
                  <Input
                    id="box_area_threshold"
                    type="number"
                    step="0.01"
                    {...register("box_area_threshold", { valueAsNumber: true })}
                    placeholder="0.1"
                    min="0.05"
                    max="1.0"
                  />
                  {errors.box_area_threshold && (
                    <p className="text-sm text-red-600">
                      {errors.box_area_threshold.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="save_interval">Save Interval (seconds)</Label>
                  <Input
                    id="save_interval"
                    type="number"
                    {...register("save_interval", { valueAsNumber: true })}
                    placeholder="600"
                    min="300"
                    max="1800"
                  />
                  {errors.save_interval && (
                    <p className="text-sm text-red-600">
                      {errors.save_interval.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame_skip_interval">
                  Frame Skip Interval (seconds)
                </Label>
                <Input
                  id="frame_skip_interval"
                  type="number"
                  step="0.1"
                  {...register("frame_skip_interval", { valueAsNumber: true })}
                  placeholder="1.0"
                  min="0.1"
                  max="5.0"
                />
                {errors.frame_skip_interval && (
                  <p className="text-sm text-red-600">
                    {errors.frame_skip_interval.message}
                  </p>
                )}
              </div>

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
                  Create Configuration
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

export default function NewDemographicsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      }>
      <DemographicsForm />
    </Suspense>
  );
}
