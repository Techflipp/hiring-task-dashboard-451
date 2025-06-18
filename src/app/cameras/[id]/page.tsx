'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCamera } from '@/lib/hooks/useCameras';
import { CameraDetail } from '@/components/cameras/CameraDetail';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  
  const { data: camera, isLoading, error } = useCamera(cameraId);
console.log("camera",camera)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={40} width={200} />
        <Skeleton height={400} />
      </div>
    );
  }

  if (error || !camera) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          {error ? 'Error loading camera details' : 'Camera not found'}
        </p>
        <Button onClick={() => router.push('/cameras')}>
          Back to Cameras
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push('/cameras')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cameras
      </Button>
      <CameraDetail camera={camera} />
    </div>
  );
}