'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DemographicsConfig } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

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

interface DemographicsConfigFormProps {
  config?: DemographicsConfig;
  cameraId: string;
  onSubmit: (data: DemographicsConfigFormData & { camera_id: string }) => Promise<void>;
  isLoading?: boolean;
}

export function DemographicsConfigForm({ 
  config, 
  cameraId, 
  onSubmit, 
  isLoading 
}: DemographicsConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicsConfigFormData>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: config ? {
      track_history_max_length: config.track_history_max_length,
      exit_threshold: config.exit_threshold,
      min_track_duration: config.min_track_duration,
      detection_confidence_threshold: config.detection_confidence_threshold,
      demographics_confidence_threshold: config.demographics_confidence_threshold,
      min_track_updates: config.min_track_updates,
      box_area_threshold: config.box_area_threshold,
      save_interval: config.save_interval,
      frame_skip_interval: config.frame_skip_interval,
    } : {
      track_history_max_length: 50,
      exit_threshold: 30,
      min_track_duration: 3,
      detection_confidence_threshold: 0.5,
      demographics_confidence_threshold: 0.7,
      min_track_updates: 5,
      box_area_threshold: 0.1,
      save_interval: 600,
      frame_skip_interval: 1.0,
    },
  });

  const onFormSubmit = async (data: DemographicsConfigFormData) => {
    await onSubmit({ ...data, camera_id: cameraId });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Demographics Configuration</h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track History Max Length
            </label>
            <Input
              type="number"
              {...register('track_history_max_length', { valueAsNumber: true })}
              min="1"
              max="100"
              placeholder="50"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum number of historical tracks (1-100)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exit Threshold (seconds)
            </label>
            <Input
              type="number"
              {...register('exit_threshold', { valueAsNumber: true })}
              min="1"
              max="300"
              placeholder="30"
            />
            <p className="text-xs text-gray-500 mt-1">Time before considering a track as exited (1-300s)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Track Duration (seconds)
            </label>
            <Input
              type="number"
              {...register('min_track_duration', { valueAsNumber: true })}
              min="1"
              max="60"
              placeholder="3"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum duration to consider a valid track (1-60s)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detection Confidence Threshold
            </label>
            <Input
              type="number"
              step="0.1"
              {...register('detection_confidence_threshold', { valueAsNumber: true })}
              min="0.1"
              max="1.0"
              placeholder="0.5"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum confidence for person detection (0.1-1.0)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demographics Confidence Threshold
            </label>
            <Input
              type="number"
              step="0.1"
              {...register('demographics_confidence_threshold', { valueAsNumber: true })}
              min="0.1"
              max="1.0"
              placeholder="0.7"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum confidence for demographics classification (0.1-1.0)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Track Updates
            </label>
            <Input
              type="number"
              {...register('min_track_updates', { valueAsNumber: true })}
              min="1"
              max="100"
              placeholder="5"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum updates required for a valid track (1-100)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Box Area Threshold
            </label>
            <Input
              type="number"
              step="0.01"
              {...register('box_area_threshold', { valueAsNumber: true })}
              min="0.05"
              max="1.0"
              placeholder="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum bounding box area ratio (0.05-1.0)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Save Interval (seconds)
            </label>
            <Input
              type="number"
              {...register('save_interval', { valueAsNumber: true })}
              min="300"
              max="1800"
              placeholder="600"
            />
            <p className="text-xs text-gray-500 mt-1">How often to save results (300-1800s)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Skip Interval
            </label>
            <Input
              type="number"
              step="0.1"
              {...register('frame_skip_interval', { valueAsNumber: true })}
              min="0.1"
              max="5.0"
              placeholder="1.0"
            />
            <p className="text-xs text-gray-500 mt-1">Interval between processed frames (0.1-5.0s)</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : config ? 'Update Configuration' : 'Create Configuration'}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}