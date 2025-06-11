'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../../lib/api';
import { useUpdateCamera } from '../../../../../hooks/use-cameras';
import { useTags } from '../../../../../hooks/use-tags';
import { CameraForm } from '../../../../../components/camera/camera-form';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { Card } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import Link from 'next/link';
import { Button } from '../../../../../components/ui/button';
import { 
  ArrowLeft, 
  Edit, 
  Camera as CameraIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

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

  const getStatusIcon = () => {
    if (camera?.is_active) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (camera?.is_active) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Camera</h2>
          <p className="text-red-600 mb-6">{(error as Error).message}</p>
          <Link href="/cameras">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cameras
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Loading state
  if (cameraLoading || tagsLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
        
        {/* Form skeleton */}
        <Card className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </Card>
      </div>
    );
  }

  // Camera not found
  if (!camera) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CameraIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Camera Not Found</h2>
          <p className="text-gray-500 mb-6">The camera you're looking for doesn't exist or has been removed.</p>
          <Link href="/cameras">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cameras
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link href={`/cameras/${camera.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Camera</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600">{camera.name}</p>
                  {getStatusIcon()}
                  {getStatusBadge()}
                </div>
              </div>
            </div>
            
            {/* Camera info summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Resolution:</span>
                <p className="font-medium">
                  {camera.stream_frame_width}×{camera.stream_frame_height}
                </p>
              </div>
              <div>
                <span className="text-gray-500">FPS:</span>
                <p className="font-medium">{camera.stream_fps}</p>
              </div>
              <div>
                <span className="text-gray-500">Quality:</span>
                <p className="font-medium">{camera.stream_quality}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status message */}
        {camera.status_message && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {!camera.is_active && <AlertTriangle className="h-4 w-4 text-amber-500" />}
              <span className={`text-sm ${camera.is_active ? 'text-green-700' : 'text-amber-700'}`}>
                <strong>Status:</strong> {camera.status_message}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Camera Configuration</h2>
          <p className="text-gray-600 text-sm">
            Update camera settings, stream configuration, and tag assignments.
          </p>
        </div>

        <CameraForm
          camera={camera}
          availableTags={tags}
          onSubmit={handleSubmit}
          isLoading={updateCameraMutation.isPending}
        />
      </Card>

      {/* Loading overlay when saving */}
      {updateCameraMutation.isPending && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium">Saving changes...</span>
            </div>
          </Card>
        </div>
      )}

      {/* Quick navigation */}
      <Card className="p-4 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <strong>Quick Actions:</strong>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link href={`/cameras/${camera.id}`}>
              <Button variant="outline" size="sm">
                <CameraIcon className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            
            <Link href={`/cameras/${camera.id}/demographics`}>
              <Button variant="outline" size="sm">
                Demographics
              </Button>
            </Link>
            
            <Link href="/cameras">
              <Button variant="outline" size="sm">
                All Cameras
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}