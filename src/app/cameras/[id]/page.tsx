'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/api';
import { CameraDetail } from '../../../../components/camera/camera-detail';
import { Skeleton } from '../../../../components/ui/skeleton';
import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { Edit, BarChart3, ArrowLeft } from 'lucide-react';

export default function CameraDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Use React.use() to unwrap the Promise as per Next.js 15 docs
  const { id } = use(params);
  
  const { data: camera, isLoading, error } = useQuery({
    queryKey: ['camera', id],
    queryFn: () => apiClient.getCamera(id),
    enabled: !!id, // Only run query when id is available
  });

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cameras">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{camera.name}</h1>
            <p className="text-gray-600">Camera Details</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/cameras/${camera.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          
          <Link href={`/cameras/${camera.id}/demographics`}>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Demographics
            </Button>
          </Link>
        </div>
      </div>

      <CameraDetail camera={camera} />
    </div>
  );
}