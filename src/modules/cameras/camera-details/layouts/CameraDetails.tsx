'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCameraDetails } from '@/modules/cameras/camera-details/hooks/useCameraDetails';
import { useUpdateCamera } from '@/modules/cameras/camera-details/hooks/useUpdateCamera';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Link from 'next/link';
import { FormItem } from '@/modules/cameras/demographics/components/Input';
import {Button} from "@mui/material";
import {Flex} from "@/modules/cameras/camera-list/components/flex";

type CameraFormData = {
    name: string;
    rtsp_url: string;
    status: 'active' | 'inactive';
};

export default function CameraDetailPage() {
    const { id: cameraId } = useParams();
    const router = useRouter();
    const { data, isLoading } = useCameraDetails(cameraId);
    const { mutate, isPending, isSuccess } = useUpdateCamera(cameraId);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<CameraFormData>({
        defaultValues: {
            name: '',
            rtsp_url: '',
            status: 'active',
        },
        values: data
            ? {
                name: data.name || '',
                rtsp_url: data.rtsp_url || '',
                status: data.is_active ? 'active' : 'inactive',
            }
            : undefined,
    });

    const onSubmit = (formData: CameraFormData) => {
        const payload = {
            name: formData.name,
            rtsp_url: formData.rtsp_url,
            is_active: formData.status === 'active',
        };

        console.log('📤 Payload to send:', payload);
        mutate(payload);
    };

    useEffect(() => {
        if (isSuccess) {
            const timeout = setTimeout(() => {
                router.push('/cameras');
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [isSuccess, router]);

    if (isLoading) return <p className="p-6">Loading Data...</p>;

    return (
        <div className="p-6 max-w-xl mt-5 mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">📷 Edit Camera Details</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormItem
                    name="name"
                    label="📛 Camera Name"
                    control={control}
                    required
                />

                <FormItem
                    name="rtsp_url"
                    label="🔗 RTSP URL"
                    control={control}
                    required
                    placeholder="rtsp://example.com/stream"
                />

                <FormItem
                    name="status"
                    label="⚙️ Status"
                    control={control}
                    required
                    type="select"
                    options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                    ]}
                />

              <Flex flexDirection={'column'}>
                  <Button
                      variant="contained"
                      type="submit"
                      disabled={isPending}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                      {isPending ? 'Saving...' : '💾 Save'}
                  </Button>

                  {isSuccess && (
                      <p className="text-green-600 mt-2">✅ Saved Successfully! Redirecting...</p>
                  )}


                  <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      href={`/cameras/${cameraId}/demographics`}
                      sx={{ mt: 2 }}
                  >
                      ⚙️ Configure Demographics
                  </Button>

                  <Button
                      variant="outlined"
                      color="primary"
                      component={Link}
                      href={`/cameras/${cameraId}/demographics/results`}
                      sx={{ mt: 2 }}
                  >
                      🔍 View Analytics
                  </Button>
              </Flex>

            </form>
        </div>
    );
}
