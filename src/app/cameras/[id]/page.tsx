"use client";

import { useQuery } from '@tanstack/react-query';
import { getCameraDetails } from '@/lib/api';
import { useParams } from 'next/navigation';
import CameraUpdateForm from '@/components/CameraUpdateForm';
import DemographicsConfigForm from '@/components/DemographicsConfigForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function CameraDetailPage() {
  const params = useParams();
  const cameraId = params.id as string;

  const { data: camera, isLoading, error } = useQuery({
    queryKey: ['camera', cameraId],
    queryFn: () => getCameraDetails(cameraId),
    enabled: !!cameraId,
  });

  if (isLoading) {
    return (
        <div className="container mx-auto p-4">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error fetching camera details</p>;
  }

  if (!camera) {
    return <p>Camera not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{camera.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Update Camera Details</h2>
          <CameraUpdateForm camera={camera} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Demographics Configuration</h2>
          <DemographicsConfigForm camera={camera} />
        </div>
      </div>
    </div>
  );
}
