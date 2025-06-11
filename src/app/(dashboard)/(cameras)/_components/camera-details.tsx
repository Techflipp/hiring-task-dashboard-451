/* eslint-disable complexity */
'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';

import { cameraQueryFn, cameraQueryKey } from '@/app/_lib/react-query/queries/cameras.queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import CameraDemographicsConfigForm from './camera-demographics-config-form';
import CameraForm from './camera-form';

export default function CameraDetails({ camera_id }: { camera_id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: cameraQueryKey({ camera_id }),
    queryFn: () => cameraQueryFn({ camera_id }),
  });

  const [editCameraDetails, setEditCameraDetails] = useState(false);
  const [editCameraDemogrphicsConfig, setEditCameraDemogrphicsConfig] = useState(false);

  const toggleEditCamera = () => {
    setEditCameraDetails((editDetails) => !editDetails);
  };

  const toggleEditCameraDemogrphicsConfig = () => {
    setEditCameraDemogrphicsConfig((editDEmographicConfig) => !editDEmographicConfig);
  };

  if (isLoading) return <Skeleton className='h-[80vh] w-full' />;
  if (error) return <div className='text-red-500'>Error loading camera details.</div>;

  return (
    <div className='w-full'>
      <Card className='mx-auto w-full rounded-2xl'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-center text-2xl font-bold sm:text-left'>
              {data?.data?.name}
            </CardTitle>
            {!editCameraDetails ? (
              <Edit onClick={toggleEditCamera} className='cursor-pointer'></Edit>
            ) : (
              <Button onClick={toggleEditCamera} className='cursor-pointer'>
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {editCameraDetails ? (
            <CameraForm
              camera_id={data?.data?.id ?? ''}
              toggleEditCamera={toggleEditCamera}
              defaultValues={{
                name: data?.data?.name,
                rtsp_url: data?.data?.rtsp_url,
                stream_frame_width: data?.data?.stream_frame_width,
                stream_frame_height: data?.data?.stream_frame_height,
                stream_max_length: data?.data?.stream_max_length,
                stream_quality: data?.data?.stream_quality,
                stream_fps: data?.data?.stream_fps,
                stream_skip_frames: data?.data?.stream_skip_frames,
                tags:
                  data?.data?.tags && data.data.tags.length > 0
                    ? (data.data.tags.map((tag) => tag.name) as [string, ...string[]])
                    : undefined,
              }}
            ></CameraForm>
          ) : (
            <div className='space-y-6'>
              {/* Snapshot */}
              <div className='w-full overflow-hidden rounded-xl'>
                <Image
                  src={data?.data?.snapshot ?? ''}
                  alt='Snapshot'
                  width={800}
                  height={500}
                  unoptimized // avoids upstream timeout issues
                  className='h-auto max-h-[500px] w-full rounded-xl object-cover'
                />
              </div>

              {/* Grid Details */}
              <div className='grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
                <DetailItem label='RTSP URL' value={data?.data?.rtsp_url ?? ''} />
                <DetailItem label='Status' value={data?.data?.status_message ?? ''} />
                <DetailItem label='Active' value={data?.data?.is_active ? 'Yes' : 'No'} />
                <DetailItem
                  label='Created At'
                  value={
                    data?.data?.created_at ? new Date(data.data.created_at).toLocaleString() : ''
                  }
                />
                <DetailItem
                  label='Updated At'
                  value={
                    data?.data?.updated_at ? new Date(data.data.updated_at).toLocaleString() : ''
                  }
                />
                <DetailItem label='Stream FPS' value={String(data?.data?.stream_fps)} />
                <DetailItem label='Quality' value={String(data?.data?.stream_quality)} />
                <DetailItem
                  label='Resolution'
                  value={`${data?.data?.stream_frame_width} x ${data?.data?.stream_frame_height}`}
                />
                <DetailItem label='Max Length' value={`${data?.data?.stream_max_length}s`} />
                <DetailItem label='Skip Frames' value={String(data?.data?.stream_skip_frames)} />
              </div>

              {/* Tags */}
              <div>
                <h4 className='mb-2 text-lg font-semibold'>Tags</h4>
                <div className='flex flex-wrap gap-2'>
                  {data?.data?.tags.map((tag) => (
                    <Badge key={tag.id} className='text-xs' style={{ backgroundColor: tag.color }}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Demographics Config */}
              <div>
                <div className='flex items-center justify-between gap-2'>
                  <h4 className='mb-2 text-lg font-semibold'>Demographics Config</h4>
                  {!editCameraDemogrphicsConfig ? (
                    <Edit
                      onClick={toggleEditCameraDemogrphicsConfig}
                      className='cursor-pointer'
                    ></Edit>
                  ) : (
                    <Button onClick={toggleEditCameraDemogrphicsConfig} className='cursor-pointer'>
                      Cancel
                    </Button>
                  )}
                </div>
                {editCameraDemogrphicsConfig ? (
                  <CameraDemographicsConfigForm
                    camera_id={data?.data?.id ?? ''}
                    config_id={data?.data?.demographics_config.id ?? ''}
                    toggleEditCameraDemogrphicsConfig={toggleEditCameraDemogrphicsConfig}
                    defaultValues={data?.data?.demographics_config}
                  ></CameraDemographicsConfigForm>
                ) : (
                  <pre className='bg-muted overflow-auto rounded-xl p-4 text-sm'>
                    {JSON.stringify(data?.data?.demographics_config, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-muted-foreground text-sm'>{label}</p>
      <p className='text-foreground text-base font-medium'>{value}</p>
    </div>
  );
}
