'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../../lib/api';
import { useUpdateCamera } from '../../../../../hooks/use-cameras';
import { useTags } from '../../../../../hooks/use-tags';
import { CameraForm } from '../../../../../components/camera/camera-form';
import { Skeleton } from '../../../../../components/ui/skeleton';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditCameraPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: camera, isLoading: cameraLoading, error } = useQuery({
    queryKey: ['camera', id],
    queryFn: () => apiClient.getCamera(id),
    enabled: !!id,
  });

  const { data: tags = [], isLoading: tagsLoading } = useTags();
  const updateCameraMutation = useUpdateCamera();

  const handleSubmit = async (data: any) => {
    try {
      await updateCameraMutation.mutateAsync({ id, data });
      router.push(`/cameras/${id}`);
    } catch (error) {
      console.error('Failed to update camera:', error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading camera: {(error as Error).message}</p>
        <Link href="/cameras">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Button>
        </Link>
      </div>
    );
  }

  if (cameraLoading || tagsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Camera not found</p>
        <Link href="/cameras">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/cameras/${camera.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Camera</h1>
          <p className="text-gray-600">{camera.name}</p>
        </div>
      </div>

      <CameraForm
        camera={camera}
        availableTags={tags}
        onSubmit={handleSubmit}
        isLoading={updateCameraMutation.isPending}
      />
    </div>
  );
}