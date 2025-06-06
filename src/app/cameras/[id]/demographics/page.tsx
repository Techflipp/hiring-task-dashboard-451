"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCamera } from "@/hooks/use-cameras";
import {
  useCreateDemographicsConfig,
  useUpdateDemographicsConfig,
} from "@/hooks/use-demographics";
import { DemographicsConfigForm } from "@/components/demographics/demographics-config-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DemographicsConfigFormData,
  DemographicsConfigUpdateFormData,
} from "@/lib/validations";
import { useState } from "react";

export default function DemographicsConfigPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  const [error, setError] = useState<string | null>(null);

  const { data: camera, isLoading } = useCamera(cameraId);
  const createConfig = useCreateDemographicsConfig();
  const updateConfig = useUpdateDemographicsConfig();

  const hasConfig = !!camera?.demographics_config;
  const configId = camera?.demographics_config?.id;

  const handleSubmit = async (
    data: DemographicsConfigFormData | DemographicsConfigUpdateFormData
  ) => {
    try {
      setError(null);

      if (hasConfig && configId) {
        await updateConfig.mutateAsync({
          id: configId,
          data: data as DemographicsConfigUpdateFormData,
        });
      } else {
        await createConfig.mutateAsync(data as DemographicsConfigFormData);
      }

      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save configuration"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Camera not found</p>
      </div>
    );
  }

  const isSubmitting = createConfig.isPending || updateConfig.isPending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-gray-900">
          {hasConfig ? "Edit" : "Create"} Demographics Configuration
        </h1>
        <p className="text-gray-600 mt-1">For camera: {camera.name}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {(createConfig.isSuccess || updateConfig.isSuccess) && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            Configuration {hasConfig ? "updated" : "created"} successfully!
          </p>
        </div>
      )}

      <DemographicsConfigForm
        cameraId={cameraId}
        config={camera.demographics_config}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
