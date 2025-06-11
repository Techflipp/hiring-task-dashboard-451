import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, DemographicsConfig as DemographicsConfigType } from '@/lib/types';
import { useCreateDemographicsConfig, useUpdateDemographicsConfig } from '@/lib/hooks/useDemographics';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const demographicsConfigSchema = z.object({
  track_history_max_length: z.number().min(1).max(100).optional(),
  exit_threshold: z.number().min(1).max(300).optional(),
  min_track_duration: z.number().min(1).max(60).optional(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.number().min(1).max(100).optional(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional(),
  save_interval: z.number().min(300).max(1800).optional(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional(),
});

type DemographicsConfigFormData = z.infer<typeof demographicsConfigSchema>;

interface DemographicsConfigProps {
  camera: Camera;
  config?: DemographicsConfigType;
}

export const DemographicsConfig: React.FC<DemographicsConfigProps> = ({ camera, config }) => {
  const [isEditing, setIsEditing] = useState(!config);
  const createConfig = useCreateDemographicsConfig();
  const updateConfig = useUpdateDemographicsConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicsConfigFormData>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: config || {
      track_history_max_length: 50,
      exit_threshold: 150,
      min_track_duration: 5,
      detection_confidence_threshold: 0.5,
      demographics_confidence_threshold: 0.5,
      min_track_updates: 10,
      box_area_threshold: 0.1,
      save_interval: 600,
      frame_skip_interval: 1.0,
    },
  });

  const onSubmit = async (data: DemographicsConfigFormData) => {
    try {
      if (config) {
        await updateConfig.mutateAsync({ id: config.id, data });
      } else {
        await createConfig.mutateAsync({ camera_id: camera.id, ...data });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save demographics config:', error);
    }
  };

  if (!isEditing && config) {
    return (
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Demographics Configuration</h2>
          <Button onClick={() => setIsEditing(true)}>Edit Configuration</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Track History Max Length</p>
            <p className="font-medium">{config.track_history_max_length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Exit Threshold</p>
            <p className="font-medium">{config.exit_threshold}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Min Track Duration</p>
            <p className="font-medium">{config.min_track_duration}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Detection Confidence</p>
            <p className="font-medium">{config.detection_confidence_threshold}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Demographics Confidence</p>
            <p className="font-medium">{config.demographics_confidence_threshold}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Save Interval</p>
            <p className="font-medium">{config.save_interval}s</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">
        {config ? 'Edit Demographics Configuration' : 'Create Demographics Configuration'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Track History Max Length"
            type="number"
            {...register('track_history_max_length', { valueAsNumber: true })}
            error={errors.track_history_max_length?.message}
          />
          <Input
            label="Exit Threshold"
            type="number"
            {...register('exit_threshold', { valueAsNumber: true })}
            error={errors.exit_threshold?.message}
          />
          <Input
            label="Min Track Duration (seconds)"
            type="number"
            {...register('min_track_duration', { valueAsNumber: true })}
            error={errors.min_track_duration?.message}
          />
          <Input
            label="Detection Confidence Threshold"
            type="number"
            step="0.1"
            {...register('detection_confidence_threshold', { valueAsNumber: true })}
            error={errors.detection_confidence_threshold?.message}
          />
          <Input
            label="Demographics Confidence Threshold"
            type="number"
            step="0.1"
            {...register('demographics_confidence_threshold', { valueAsNumber: true })}
            error={errors.demographics_confidence_threshold?.message}
          />
          <Input
            label="Min Track Updates"
            type="number"
            {...register('min_track_updates', { valueAsNumber: true })}
            error={errors.min_track_updates?.message}
          />
          <Input
            label="Box Area Threshold"
            type="number"
            step="0.05"
            {...register('box_area_threshold', { valueAsNumber: true })}
            error={errors.box_area_threshold?.message}
          />
          <Input
            label="Save Interval (seconds)"
            type="number"
            {...register('save_interval', { valueAsNumber: true })}
            error={errors.save_interval?.message}
          />
          <Input
            label="Frame Skip Interval"
            type="number"
            step="0.1"
            {...register('frame_skip_interval', { valueAsNumber: true })}
            error={errors.frame_skip_interval?.message}
          />
        </div>
        <div className="flex justify-end space-x-4">
          {config && (
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            isLoading={createConfig.isPending || updateConfig.isPending}
          >
            {config ? 'Update Configuration' : 'Create Configuration'}
          </Button>
        </div>
      </form>
    </Card>
  );
};