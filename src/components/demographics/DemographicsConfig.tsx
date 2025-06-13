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

  const defaultValues = {
    track_history_max_length: 50,
    exit_threshold: 150,
    min_track_duration: 5,
    detection_confidence_threshold: 0.5,
    demographics_confidence_threshold: 0.5,
    min_track_updates: 10,
    box_area_threshold: 0.1,
    save_interval: 600,
    frame_skip_interval: 1.0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicsConfigFormData>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: config || defaultValues,
  });

  const onSubmit = async (data: DemographicsConfigFormData) => {
    try {
      // Ensure all numeric fields are numbers, not strings
      const processedData = {
        track_history_max_length: Number(data.track_history_max_length) || defaultValues.track_history_max_length,
        exit_threshold: Number(data.exit_threshold) || defaultValues.exit_threshold,
        min_track_duration: Number(data.min_track_duration) || defaultValues.min_track_duration,
        detection_confidence_threshold: Number(data.detection_confidence_threshold) || defaultValues.detection_confidence_threshold,
        demographics_confidence_threshold: Number(data.demographics_confidence_threshold) || defaultValues.demographics_confidence_threshold,
        min_track_updates: Number(data.min_track_updates) || defaultValues.min_track_updates,
        box_area_threshold: Number(data.box_area_threshold) || defaultValues.box_area_threshold,
        save_interval: Number(data.save_interval) || defaultValues.save_interval,
        frame_skip_interval: Number(data.frame_skip_interval) || defaultValues.frame_skip_interval,
      };

      if (config) {
        await updateConfig.mutateAsync({ id: config.id, data: processedData });
      } else {
        await createConfig.mutateAsync({ camera_id: camera.id, ...processedData });
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
            <p className="text-sm text-gray-500">Min Track Updates</p>
            <p className="font-medium">{config.min_track_updates}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Box Area Threshold</p>
            <p className="font-medium">{config.box_area_threshold}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Save Interval</p>
            <p className="font-medium">{config.save_interval}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Frame Skip Interval</p>
            <p className="font-medium">{config.frame_skip_interval}</p>
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
            placeholder="50"
          />
          <Input
            label="Exit Threshold"
            type="number"
            {...register('exit_threshold', { valueAsNumber: true })}
            error={errors.exit_threshold?.message}
            placeholder="150"
          />
          <Input
            label="Min Track Duration (seconds)"
            type="number"
            {...register('min_track_duration', { valueAsNumber: true })}
            error={errors.min_track_duration?.message}
            placeholder="5"
          />
          <Input
            label="Detection Confidence Threshold"
            type="number"
            step="0.1"
            {...register('detection_confidence_threshold', { valueAsNumber: true })}
            error={errors.detection_confidence_threshold?.message}
            placeholder="0.5"
          />
          <Input
            label="Demographics Confidence Threshold"
            type="number"
            step="0.1"
            {...register('demographics_confidence_threshold', { valueAsNumber: true })}
            error={errors.demographics_confidence_threshold?.message}
            placeholder="0.5"
          />
          <Input
            label="Min Track Updates"
            type="number"
            {...register('min_track_updates', { valueAsNumber: true })}
            error={errors.min_track_updates?.message}
            placeholder="10"
          />
          <Input
            label="Box Area Threshold"
            type="number"
            step="0.05"
            {...register('box_area_threshold', { valueAsNumber: true })}
            error={errors.box_area_threshold?.message}
            placeholder="0.1"
          />
          <Input
            label="Save Interval (seconds)"
            type="number"
            {...register('save_interval', { valueAsNumber: true })}
            error={errors.save_interval?.message}
            placeholder="600"
          />
          <Input
            label="Frame Skip Interval"
            type="number"
            step="0.1"
            {...register('frame_skip_interval', { valueAsNumber: true })}
            error={errors.frame_skip_interval?.message}
            placeholder="1.0"
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Configuration Guide</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Track History:</strong> Number of frames to keep in tracking history (1-100)</li>
            <li>• <strong>Exit Threshold:</strong> Frames before considering a person has exited (1-300)</li>
            <li>• <strong>Min Track Duration:</strong> Minimum seconds to track before recording (1-60)</li>
            <li>• <strong>Detection Confidence:</strong> Minimum confidence for person detection (0.1-1.0)</li>
            <li>• <strong>Demographics Confidence:</strong> Minimum confidence for demographic analysis (0.1-1.0)</li>
            <li>• <strong>Save Interval:</strong> How often to save results in seconds (300-1800)</li>
          </ul>
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