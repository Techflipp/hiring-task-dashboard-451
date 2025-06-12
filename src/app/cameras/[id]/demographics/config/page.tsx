'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '../../../../../../lib/api';
import { useCreateDemographicsConfig, useUpdateDemographicsConfig } from '../../../../../../hooks/use-demographics';
import { CreateDemographicsConfigPayload, UpdateDemographicsConfigPayload } from '../../../../../../lib/types';
import { DemographicsConfigForm } from '../../../../../../components/demographics/config-form';
import { Card } from '../../../../../../components/ui/card';
import { Badge } from '../../../../../../components/ui/badge';
import { Skeleton } from '../../../../../../components/ui/skeleton';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/button';
import { 
  ArrowLeft, 
  Settings, 
  Camera as CameraIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Info
} from 'lucide-react';

export default function DemographicsConfigPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: camera, isLoading: cameraLoading, error: cameraError } = useQuery({
    queryKey: ['camera', id],
    queryFn: () => apiClient.getCamera(id),
  });

  const createConfigMutation = useCreateDemographicsConfig();
  const updateConfigMutation = useUpdateDemographicsConfig();

  const handleSubmit = async (data: any) => {
    try {
      if (camera?.demographics_config) {
        // Update existing config - only send the config fields, no camera_id
        const updatePayload: UpdateDemographicsConfigPayload = {
          track_history_max_length: data.track_history_max_length,
          exit_threshold: data.exit_threshold,
          min_track_duration: data.min_track_duration,
          detection_confidence_threshold: data.detection_confidence_threshold,
          demographics_confidence_threshold: data.demographics_confidence_threshold,
          min_track_updates: data.min_track_updates,
          box_area_threshold: data.box_area_threshold,
          save_interval: data.save_interval,
          frame_skip_interval: data.frame_skip_interval,
        };
        
        await updateConfigMutation.mutateAsync({
          id: camera.demographics_config.id,
          data: updatePayload,
        });

        // Success toast for update
        toast.success('Demographics configuration updated!', {
          description: `Configuration for ${camera?.name || 'camera'} has been successfully updated.`,
          duration: 4000,
          action: {
            label: 'View Analytics',
            onClick: () => router.push(`/cameras/${id}/demographics`),
          },
        });
      } else {
        // Create new config - include camera_id
        const createPayload: CreateDemographicsConfigPayload = {
          track_history_max_length: data.track_history_max_length,
          exit_threshold: data.exit_threshold,
          min_track_duration: data.min_track_duration,
          detection_confidence_threshold: data.detection_confidence_threshold,
          demographics_confidence_threshold: data.demographics_confidence_threshold,
          min_track_updates: data.min_track_updates,
          box_area_threshold: data.box_area_threshold,
          save_interval: data.save_interval,
          frame_skip_interval: data.frame_skip_interval,
          camera_id: id,
        };
        
        await createConfigMutation.mutateAsync(createPayload);

        // Success toast for create
        toast.success('Demographics configuration created!', {
          description: `Demographics analysis is now enabled for ${camera?.name || 'this camera'}.`,
          duration: 4000,
          action: {
            label: 'View Analytics',
            onClick: () => router.push(`/cameras/${id}/demographics`),
          },
        });
      }
      
      // Delay navigation to show toast
      setTimeout(() => {
        router.push(`/cameras/${id}/demographics`);
      }, 1500);

    } catch (error) {
      // Error toast
      const isUpdate = !!camera?.demographics_config;
      toast.error(`Failed to ${isUpdate ? 'update' : 'create'} demographics configuration`, {
        description: error instanceof Error ? error.message : 'An unexpected error occurred while saving the configuration.',
        duration: 5000,
      });
      
      console.error('Failed to save demographics config:', error);
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

  const isEditMode = !!camera?.demographics_config;
  const isLoading = createConfigMutation.isPending || updateConfigMutation.isPending;
  const error = createConfigMutation.error || updateConfigMutation.error;

  // Error state
  if (cameraError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-10 sm:h-12 w-10 sm:w-12 text-red-500" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Camera</h2>
          <p className="text-sm sm:text-base text-red-600 mb-6">{(cameraError as Error).message}</p>
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
  if (cameraLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header skeleton */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
            <Skeleton className="h-9 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
              <Skeleton className="h-4 w-32 sm:w-48" />
            </div>
          </div>
        </Card>
        
        {/* Form skeleton */}
        <Card className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-6 w-32 sm:w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 sm:h-24 w-full" />
              <Skeleton className="h-20 sm:h-24 w-full" />
              <Skeleton className="h-20 sm:h-24 w-full" />
              <Skeleton className="h-20 sm:h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
        </Card>
      </div>
    );
  }

  // Camera not found
  if (!camera) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CameraIcon className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Camera Not Found</h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6">The camera you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
          <Link href={`/cameras/${camera.id}/demographics`}>
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="sm:hidden">Back</span>
              <span className="hidden sm:inline">Back to Demographics</span>
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 mb-3">
              <div className={`p-2 rounded-lg w-fit ${isEditMode ? 'bg-blue-100' : 'bg-purple-100'}`}>
                <Settings className={`h-5 sm:h-6 w-5 sm:w-6 ${isEditMode ? 'text-blue-600' : 'text-purple-600'}`} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {isEditMode ? 'Edit Demographics Configuration' : 'Configure Demographics'}
                </h1>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0 mt-1">
                  <p className="text-sm sm:text-base text-gray-600">{camera.name}</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuration status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={isEditMode ? "default" : "outline"} className={
                  isEditMode 
                    ? "bg-blue-100 text-blue-800 border-blue-200" 
                    : "text-gray-600"
                }>
                  {isEditMode ? 'Configuration Active' : 'No Configuration'}
                </Badge>
              </div>
              
              {isEditMode && camera.demographics_config && (
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="font-medium">
                    {new Date(camera.demographics_config.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-1">
              {isEditMode ? 'Editing Demographics Configuration' : 'Setting Up Demographics'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-800">
              {isEditMode 
                ? 'Modify the demographics analysis parameters for this camera. Changes will take effect immediately.'
                : 'Configure demographic analysis parameters to enable people counting, age/gender detection, and analytics for this camera.'
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-3 sm:p-4 border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <span className="text-sm sm:text-base text-red-800">
              <strong>Error:</strong> {(error as Error).message}
            </span>
          </div>
        </Card>
      )}

      {/* Form */}
      <DemographicsConfigForm
        config={camera.demographics_config}
        cameraId={camera.id}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditMode={isEditMode}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <Card className="p-4 sm:p-6 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600 shrink-0" />
              <span className="text-sm sm:text-base font-medium">
                {isEditMode ? 'Updating configuration...' : 'Creating configuration...'}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Navigation */}
      <Card className="p-3 sm:p-4 bg-gray-50">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            <strong>After {isEditMode ? 'updating' : 'creating'}:</strong> You&apos;ll be redirected to the demographics analytics page.
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
            <Link href={`/cameras/${camera.id}`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <CameraIcon className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Camera</span>
                <span className="hidden sm:inline">Camera Details</span>
              </Button>
            </Link>
            
            <Link href={`/cameras/${camera.id}/demographics`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <span className="sm:hidden">Analytics</span>
                <span className="hidden sm:inline">Demographics Analytics</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}