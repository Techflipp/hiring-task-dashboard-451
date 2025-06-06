"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCamera, useUpdateCamera } from "@/hooks/use-cameras";
import { useTags } from "@/hooks/use-tags";
import { CameraForm } from "@/components/cameras/camera-form";
import { CameraDetailSkeleton } from "@/components/cameras/camera-detail-skeleton";
import { Button } from "@/components/ui/button";
import { CameraUpdateFormData } from "@/lib/validations";
import { useState } from "react";

export default function EditCameraPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  const [error, setError] = useState<string | null>(null);

  const { data: camera, isLoading: isCameraLoading } = useCamera(cameraId);
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const updateCamera = useUpdateCamera();

  const isLoading = isCameraLoading || isTagsLoading;

  const handleSubmit = async (data: CameraUpdateFormData) => {
    try {
      setError(null);
      await updateCamera.mutateAsync({
        id: cameraId,
        data,
      });
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update camera"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CameraDetailSkeleton />
      </div>
    );
  }

  if (!camera || !tags) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Camera not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900">Edit Camera</h1>
        <p className="text-gray-600 mt-1">
          Update camera settings and configuration
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {updateCamera.isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Camera updated successfully!</p>
        </div>
      )}

      <CameraForm
        camera={camera}
        tags={tags}
        onSubmit={handleSubmit}
        isSubmitting={updateCamera.isPending}
      />
    </div>
  );
}
