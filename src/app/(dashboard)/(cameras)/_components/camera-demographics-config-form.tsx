/* eslint-disable complexity */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getClientQueryClient } from '@/app/_lib/react-query/client';
import { camerasQueryKey, cameraQueryKey } from '@/app/_lib/react-query/queries/cameras.queries';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { editCameraDemographicsConfig } from '@/server/actions/demographics/demographics.actions';
import {
  EditCameraDemographicsConfigInput,
  EditCameraDemographicsConfigSchema,
} from '@/server/actions/demographics/demographics.inputs';

export default function CameraDemographicsConfigForm({
  camera_id,
  config_id,
  defaultValues,
  toggleEditCameraDemogrphicsConfig,
}: {
  camera_id: string;
  config_id: string;
  defaultValues?: Partial<EditCameraDemographicsConfigInput>;
  toggleEditCameraDemogrphicsConfig: () => void;
}) {
  const queryClient = getClientQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCameraDemographicsConfigInput>({
    resolver: zodResolver(EditCameraDemographicsConfigSchema),
    defaultValues: {
      track_history_max_length: defaultValues?.track_history_max_length ?? 0,
      exit_threshold: defaultValues?.exit_threshold ?? 0,
      min_track_duration: defaultValues?.min_track_duration ?? 0,
      detection_confidence_threshold: defaultValues?.detection_confidence_threshold ?? 0.1,
      demographics_confidence_threshold: defaultValues?.demographics_confidence_threshold ?? 0.1,
      min_track_updates: defaultValues?.min_track_updates ?? 0,
      box_area_threshold: defaultValues?.box_area_threshold ?? 0.05,
      save_interval: defaultValues?.save_interval ?? 0,
      frame_skip_interval: defaultValues?.frame_skip_interval ?? 0.1,
    },
  });

  const editCameraDemographicsDetailsMutation = useMutation({
    mutationFn: (data: EditCameraDemographicsConfigInput) =>
      editCameraDemographicsConfig(config_id, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: camerasQueryKey() });
        queryClient.invalidateQueries({ queryKey: cameraQueryKey({ camera_id }) });
        toast(res.message, { type: 'success' });
        toggleEditCameraDemogrphicsConfig();
        return;
      }
      toast.error(res.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: EditCameraDemographicsConfigInput) => {
    editCameraDemographicsDetailsMutation.mutate(data);
  };

  return (
    <Card className='mx-auto w-full max-w-3xl rounded-2xl p-6 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold'>Edit Analytics Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className=''>
          <div className='grid grid-cols-1 gap-2 space-y-6 xl:grid-cols-2'>
            {[
              { name: 'track_history_max_length', label: 'Track History Max Length' },
              { name: 'exit_threshold', label: 'Exit Threshold' },
              { name: 'min_track_duration', label: 'Min Track Duration' },
              { name: 'detection_confidence_threshold', label: 'Detection Confidence Threshold' },
              {
                name: 'demographics_confidence_threshold',
                label: 'Demographics Confidence Threshold',
              },
              { name: 'min_track_updates', label: 'Min Track Updates' },
              { name: 'box_area_threshold', label: 'Box Area Threshold' },
              { name: 'save_interval', label: 'Save Interval' },
              { name: 'frame_skip_interval', label: 'Frame Skip Interval' },
            ].map((field) => (
              <div className='space-y-2' key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  type='number'
                  step='any'
                  {...register(field.name as keyof EditCameraDemographicsConfigInput, {
                    valueAsNumber: true,
                  })}
                  id={field.name}
                />
                {errors[field.name as keyof typeof errors] && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors[field.name as keyof typeof errors]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className='pt-4'>
            <Button type='submit' className='w-full'>
              {editCameraDemographicsDetailsMutation.isPending ? <Spinner /> : 'Save Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
