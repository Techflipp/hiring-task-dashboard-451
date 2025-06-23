'use client';

import { useState, useEffect } from 'react';
import { useCamera, useUpdateCamera, useCreateDemographicsConfig, useUpdateDemographicsConfig } from '@/hooks/use-cameras';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const cameraSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens and underscores'),
  rtsp_url: z.string()
    .min(1, 'RTSP URL is required')
    .url('Must be a valid URL')
    .regex(/^rtsp:\/\//i, 'URL must start with rtsp://')
    .max(500, 'RTSP URL must be less than 500 characters'),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
});

const demographicsSchema = z.object({
  track_history_max_length: z.number().min(1).max(100).optional(),
  exit_threshold: z.number().min(1).max(300).optional(),
  min_track_duration: z.number().min(1).max(60).optional(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.number().min(1).max(100).optional(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional(),
  save_interval: z.number().min(300).max(1800).optional(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional(),
  gender: z.boolean(),
  age: z.boolean(),
  emotion: z.boolean(),
  ethnicity: z.boolean(),
});

type CameraFormData = z.infer<typeof cameraSchema>;
type DemographicsFormData = z.infer<typeof demographicsSchema>;

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: camera, isLoading, error } = useCamera(params.id);
  const updateCamera = useUpdateCamera();
  const createDemographicsConfig = useCreateDemographicsConfig();
  const updateDemographicsConfig = useUpdateDemographicsConfig();

  const { register: registerCamera, handleSubmit: handleSubmitCamera, formState: { errors: cameraErrors, isDirty, isValid }, reset: resetCamera } = useForm({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: '',
      rtsp_url: '',
    },
    mode: 'onChange',
  });

  const { register: registerDemographics, handleSubmit: handleSubmitDemographics, formState: { errors: demographicsErrors }, reset: resetDemographics } = useForm({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      track_history_max_length: 0,
      exit_threshold: 0,
      min_track_duration: 0,
      detection_confidence_threshold: 0.5,
      demographics_confidence_threshold: 0.5,
      min_track_updates: 0,
      box_area_threshold: 0.05,
      save_interval: 300,
      frame_skip_interval: 0.1,
      gender: false,
      age: false,
      emotion: false,
      ethnicity: false,
    },
  });

  // Update form values when camera data loads
  useEffect(() => {
    if (camera) {
      resetCamera({
        name: camera.name,
        rtsp_url: camera.rtsp_url,
      });

      if (camera.demographics_config) {
        resetDemographics({
          track_history_max_length: camera.demographics_config.track_history_max_length,
          exit_threshold: camera.demographics_config.exit_threshold,
          min_track_duration: camera.demographics_config.min_track_duration,
          detection_confidence_threshold: camera.demographics_config.detection_confidence_threshold,
          demographics_confidence_threshold: camera.demographics_config.demographics_confidence_threshold,
          min_track_updates: camera.demographics_config.min_track_updates,
          box_area_threshold: camera.demographics_config.box_area_threshold,
          save_interval: camera.demographics_config.save_interval,
          frame_skip_interval: camera.demographics_config.frame_skip_interval,
          gender: camera.demographics_config.gender,
          age: camera.demographics_config.age,
          emotion: camera.demographics_config.emotion,
          ethnicity: camera.demographics_config.ethnicity,
        });
      }
    }
  }, [camera, resetCamera, resetDemographics]);

  const onSubmitCamera = async (data: CameraFormData) => {
    try {
      await updateCamera.mutateAsync({ id: params.id, ...data });
      toast.success('Camera updated successfully');
      router.push('/cameras');
    } catch (error) {
      toast.error('Failed to update camera');
    }
  };

  const onSubmitDemographics = async (data: DemographicsFormData) => {
    try {
      if (camera?.demographics_config) {
        await updateDemographicsConfig.mutateAsync({ id: camera.demographics_config.id, ...data });
      } else {
        await createDemographicsConfig.mutateAsync({ camera_id: params.id, ...data });
      }
      toast.success('Demographics configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update demographics configuration');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading camera: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Camera Details</h1>
        <Link href="/cameras">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cameras
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmitCamera(onSubmitCamera)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...registerCamera('name')}
            className={`mt-1 block w-[40%] p-2 text-[18px] rounded-md border ${
              cameraErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } shadow-sm sm:text-sm`}
            disabled={updateCamera.isPending}
            placeholder="Enter camera name"
          />
          {cameraErrors.name && (
            <p className="mt-1 text-sm text-red-600">{cameraErrors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">RTSP URL</label>
          <input
            type="text"
            {...registerCamera('rtsp_url')}
            className={`mt-1 block w-[40%] p-2 text-[18px] rounded-md border ${
              cameraErrors.rtsp_url ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } shadow-sm sm:text-sm`}
            disabled={updateCamera.isPending}
            placeholder="rtsp://example.com/stream"
          />
          {cameraErrors.rtsp_url && (
            <p className="mt-1 text-sm text-red-600">{cameraErrors.rtsp_url.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={updateCamera.isPending || !isDirty || !isValid}
          className="w-[20%]"
        >
          {updateCamera.isPending ? 'Updating...' : 'Update Camera'}
        </Button>
      </form>

      <form onSubmit={handleSubmitDemographics(onSubmitDemographics)} className="space-y-4">
        <h2 className="text-xl font-semibold">Demographics Configuration</h2>
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...registerDemographics('gender')} 
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={updateDemographicsConfig.isPending || createDemographicsConfig.isPending}
            />
            <span className="ml-2">Gender</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...registerDemographics('age')} 
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={updateDemographicsConfig.isPending || createDemographicsConfig.isPending}
            />
            <span className="ml-2">Age</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...registerDemographics('emotion')} 
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={updateDemographicsConfig.isPending || createDemographicsConfig.isPending}
            />
            <span className="ml-2">Emotion</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              {...registerDemographics('ethnicity')} 
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={updateDemographicsConfig.isPending || createDemographicsConfig.isPending}
            />
            <span className="ml-2">Ethnicity</span>
          </label>
        </div>

      <div className="flex gap-3 items-center">
      <Button 
          type="submit" 
          disabled={updateDemographicsConfig.isPending || createDemographicsConfig.isPending}
        >
          {updateDemographicsConfig.isPending || createDemographicsConfig.isPending 
            ? 'Updating...' 
            : 'Update Demographics Config'}
        </Button>
        <Link href={`/cameras/${params.id}/analytics`}>
        <Button>View Analytics</Button>
      </Link>
      </div>
      </form>


    </div>
  );
} 