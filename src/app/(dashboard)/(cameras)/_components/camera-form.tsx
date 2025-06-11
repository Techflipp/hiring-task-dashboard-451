/* eslint-disable complexity */
'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getClientQueryClient } from '@/app/_lib/react-query/client';
import {
  cameraQueryKey,
  camerasQueryKey,
  editCameraDetailsMutationFn,
} from '@/app/_lib/react-query/queries/cameras.queries';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  EditCameraDetailsInput,
  EditCameraDetailsSchema,
} from '@/server/actions/cameras/cameras.inputs';

export default function CameraForm({
  camera_id,
  toggleEditCamera,
  defaultValues,
}: {
  camera_id: string;
  toggleEditCamera: () => void;
  defaultValues?: Partial<EditCameraDetailsInput>;
}) {
  const [queryClient] = useState(getClientQueryClient);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCameraDetailsInput>({
    resolver: zodResolver(EditCameraDetailsSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      rtsp_url: defaultValues?.rtsp_url ?? '',
      stream_frame_width: defaultValues?.stream_frame_width ?? 640,
      stream_frame_height: defaultValues?.stream_frame_height ?? 480,
      stream_max_length: defaultValues?.stream_max_length ?? 60,
      stream_quality: defaultValues?.stream_quality ?? 75,
      stream_fps: defaultValues?.stream_fps ?? 30,
      stream_skip_frames: defaultValues?.stream_skip_frames ?? 0,
      tags: defaultValues?.tags,
    },
  });

  const editCameraDetailsMutation = useMutation({
    mutationFn: (data: EditCameraDetailsInput) => editCameraDetailsMutationFn(camera_id, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: camerasQueryKey() });
        queryClient.invalidateQueries({ queryKey: cameraQueryKey({ camera_id }) });
        toast(res.message, { type: 'success' });
        toggleEditCamera();
        return;
      }
      toast(res.message, { type: 'error' });
    },
    onError: (err) => {
      toast(err.message, { type: 'error' });
    },
  });

  const handleEditCameraSubmit = (data: EditCameraDetailsInput) => {
    editCameraDetailsMutation.mutate(data);
  };

  return (
    <Card className='mx-auto w-full max-w-3xl rounded-2xl p-6 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Edit Camera</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleEditCameraSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Camera Name</Label>
            <Input {...register('name')} id='name' placeholder='Camera name' />
            {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='rtsp_url'>RTSP URL</Label>
            <Input {...register('rtsp_url')} id='rtsp_url' placeholder='rtsp://...' />
            {errors.rtsp_url && (
              <p className='mt-1 text-sm text-red-500'>{errors.rtsp_url.message}</p>
            )}
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='stream_frame_width'>Stream Width</Label>
              <Input
                type='number'
                {...register('stream_frame_width', { valueAsNumber: true })}
                id='stream_frame_width'
              />
              {errors.stream_frame_width && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_frame_width.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='stream_frame_height'>Stream Height</Label>
              <Input
                type='number'
                {...register('stream_frame_height', { valueAsNumber: true })}
                id='stream_frame_height'
              />
              {errors.stream_frame_height && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_frame_height.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='stream_max_length'>Max Length (sec)</Label>
              <Input
                type='number'
                {...register('stream_max_length', { valueAsNumber: true })}
                id='stream_max_length'
              />
              {errors.stream_max_length && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_max_length.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='stream_quality'>Stream Quality</Label>
              <Input
                type='number'
                {...register('stream_quality', { valueAsNumber: true })}
                id='stream_quality'
              />
              {errors.stream_quality && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_quality.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='stream_fps'>FPS</Label>
              <Input
                type='number'
                {...register('stream_fps', { valueAsNumber: true })}
                id='stream_fps'
              />
              {errors.stream_fps && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_fps.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='stream_skip_frames'>Skip Frames</Label>
              <Input
                type='number'
                {...register('stream_skip_frames', { valueAsNumber: true })}
                id='stream_skip_frames'
              />
              {errors.stream_skip_frames && (
                <p className='mt-1 text-sm text-red-500'>{errors.stream_skip_frames.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tags'>Tags (comma separated)</Label>
            <Input
              id='tags'
              placeholder='tag1, tag2, tag3'
              defaultValue={(defaultValues?.tags ?? []).join(', ')}
              {...register('tags', {
                setValueAs: (v: unknown) => {
                  if (typeof v === 'string') {
                    return v
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean);
                  }
                  return Array.isArray(v) ? v : [];
                },
              })}
            />
            {errors.tags && <p className='mt-1 text-sm text-red-500'>{errors.tags.message}</p>}
          </div>

          <div className='pt-4'>
            <Button type='submit' className='w-full cursor-pointer'>
              {editCameraDetailsMutation.isPending ? <Spinner></Spinner> : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
