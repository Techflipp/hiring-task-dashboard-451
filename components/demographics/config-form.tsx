'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DemographicsConfig } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { 
  Settings, 
  Target, 
  Users, 
  Save,
  RotateCcw,
  Info
} from 'lucide-react';

const demographicsConfigSchema = z.object({
  track_history_max_length: z.number()
    .min(5, 'Minimum track history is 5')
    .max(200, 'Maximum track history is 200')
    .int('Must be a whole number'),
  exit_threshold: z.number()
    .min(5, 'Minimum exit threshold is 5 seconds')
    .max(300, 'Maximum exit threshold is 300 seconds')
    .int('Must be a whole number'),
  min_track_duration: z.number()
    .min(1, 'Minimum track duration is 1 second')
    .max(60, 'Maximum track duration is 60 seconds')
    .int('Must be a whole number'),
  detection_confidence_threshold: z.number()
    .min(0.1, 'Minimum confidence is 0.1')
    .max(1.0, 'Maximum confidence is 1.0'),
  demographics_confidence_threshold: z.number()
    .min(0.1, 'Minimum confidence is 0.1')
    .max(1.0, 'Maximum confidence is 1.0'),
  min_track_updates: z.number()
    .min(1, 'Minimum track updates is 1')
    .max(100, 'Maximum track updates is 100')
    .int('Must be a whole number'),
  box_area_threshold: z.number()
    .min(0.01, 'Minimum box area is 0.01')
    .max(1.0, 'Maximum box area is 1.0'),
  save_interval: z.number()
    .min(10, 'Minimum save interval is 10 seconds')
    .max(3600, 'Maximum save interval is 1 hour (3600 seconds)')
    .int('Must be a whole number'),
  frame_skip_interval: z.number()
    .min(0.1, 'Minimum frame skip is 0.1')
    .max(10.0, 'Maximum frame skip is 10.0'),
});

type DemographicsConfigFormData = z.infer<typeof demographicsConfigSchema>;

interface DemographicsConfigFormProps {
  config?: DemographicsConfig;
  cameraId: string;
  onSubmit: (data: DemographicsConfigFormData) => Promise<void>;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export function DemographicsConfigForm({ 
  config, 
  onSubmit, 
  isLoading,
  isEditMode = false
}: DemographicsConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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
      // Sensible defaults for new configurations
      track_history_max_length: 30,
      exit_threshold: 75,
      min_track_duration: 3,
      detection_confidence_threshold: 0.6,
      demographics_confidence_threshold: 0.4,
      min_track_updates: 5,
      box_area_threshold: 0.15,
      save_interval: 300,
      frame_skip_interval: 2.5,
    },
  });

  const watchedValues = watch();

  const resetToDefaults = () => {
    const defaults = {
      track_history_max_length: 30,
      exit_threshold: 75,
      min_track_duration: 3,
      detection_confidence_threshold: 0.6,
      demographics_confidence_threshold: 0.4,
      min_track_updates: 5,
      box_area_threshold: 0.15,
      save_interval: 300,
      frame_skip_interval: 2.5,
    };
    reset(defaults);
  };

  const onFormSubmit = async (data: DemographicsConfigFormData) => {
    await onSubmit(data);
  };

  // Helper to format time durations
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };
  

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Tracking Parameters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Tracking Parameters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track History Max Length
              <span className="text-xs text-gray-500 ml-1">({watchedValues.track_history_max_length} frames)</span>
            </label>
            <Input
              type="number"
              {...register('track_history_max_length', { valueAsNumber: true })}
              min="5"
              max="200"
              className={errors.track_history_max_length ? 'border-red-500' : ''}
            />
            {errors.track_history_max_length && (
              <p className="mt-1 text-sm text-red-600">{errors.track_history_max_length.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of frames to keep in tracking history (5-200)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exit Threshold
              <span className="text-xs text-gray-500 ml-1">({formatDuration(watchedValues.exit_threshold)})</span>
            </label>
            <Input
              type="number"
              {...register('exit_threshold', { valueAsNumber: true })}
              min="5"
              max="300"
              className={errors.exit_threshold ? 'border-red-500' : ''}
            />
            {errors.exit_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.exit_threshold.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Time before considering a person has exited (5-300 seconds)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Track Duration
              <span className="text-xs text-gray-500 ml-1">({formatDuration(watchedValues.min_track_duration)})</span>
            </label>
            <Input
              type="number"
              {...register('min_track_duration', { valueAsNumber: true })}
              min="1"
              max="60"
              className={errors.min_track_duration ? 'border-red-500' : ''}
            />
            {errors.min_track_duration && (
              <p className="mt-1 text-sm text-red-600">{errors.min_track_duration.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum time to track a person (1-60 seconds)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Track Updates
              <span className="text-xs text-gray-500 ml-1">({watchedValues.min_track_updates} updates)</span>
            </label>
            <Input
              type="number"
              {...register('min_track_updates', { valueAsNumber: true })}
              min="1"
              max="100"
              className={errors.min_track_updates ? 'border-red-500' : ''}
            />
            {errors.min_track_updates && (
              <p className="mt-1 text-sm text-red-600">{errors.min_track_updates.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum number of tracking updates required (1-100)
            </p>
          </div>
        </div>
      </Card>

      {/* Detection Confidence */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Detection Confidence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detection Confidence Threshold
              <span className="text-xs text-gray-500 ml-1">({(watchedValues.detection_confidence_threshold * 100).toFixed(0)}%)</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                {...register('detection_confidence_threshold', { valueAsNumber: true })}
                min="0.1"
                max="1.0"
                step="0.05"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>
            {errors.detection_confidence_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.detection_confidence_threshold.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum confidence for person detection (higher = more strict)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demographics Confidence Threshold
              <span className="text-xs text-gray-500 ml-1">({(watchedValues.demographics_confidence_threshold * 100).toFixed(0)}%)</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                {...register('demographics_confidence_threshold', { valueAsNumber: true })}
                min="0.1"
                max="1.0"
                step="0.05"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>
            {errors.demographics_confidence_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.demographics_confidence_threshold.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum confidence for age/gender classification
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Box Area Threshold
              <span className="text-xs text-gray-500 ml-1">({(watchedValues.box_area_threshold * 100).toFixed(1)}%)</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                {...register('box_area_threshold', { valueAsNumber: true })}
                min="0.01"
                max="1.0"
                step="0.01"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1%</span>
                <span>100%</span>
              </div>
            </div>
            {errors.box_area_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.box_area_threshold.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum bounding box area relative to frame size (filters out small detections)
            </p>
          </div>
        </div>
      </Card>

      {/* Processing Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          Processing Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Save Interval
              <span className="text-xs text-gray-500 ml-1">({formatDuration(watchedValues.save_interval)})</span>
            </label>
            <Input
              type="number"
              {...register('save_interval', { valueAsNumber: true })}
              min="10"
              max="3600"
              className={errors.save_interval ? 'border-red-500' : ''}
            />
            {errors.save_interval && (
              <p className="mt-1 text-sm text-red-600">{errors.save_interval.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              How often to save analytics data (10-3600 seconds)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Skip Interval
              <span className="text-xs text-gray-500 ml-1">({watchedValues.frame_skip_interval}s)</span>
            </label>
            <Input
              type="number"
              step="0.1"
              {...register('frame_skip_interval', { valueAsNumber: true })}
              min="0.1"
              max="10.0"
              className={errors.frame_skip_interval ? 'border-red-500' : ''}
            />
            {errors.frame_skip_interval && (
              <p className="mt-1 text-sm text-red-600">{errors.frame_skip_interval.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Interval between processed frames (0.1-10.0 seconds)
            </p>
          </div>
        </div>
      </Card>

      {/* Performance Impact Info */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Performance Impact</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• <strong>Higher confidence thresholds</strong> = More accurate but fewer detections</li>
              <li>• <strong>Lower frame skip interval</strong> = More processing but higher accuracy</li>
              <li>• <strong>Longer save intervals</strong> = Better performance but less frequent updates</li>
              <li>• <strong>Larger box area threshold</strong> = Filters out distant/small people</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <Card className="p-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="flex-1 sm:flex-none sm:min-w-40"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Configuration' : 'Create Configuration')
            }
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetToDefaults}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p><strong>Note:</strong> Changes will take effect immediately after saving. Demographics processing will restart with new parameters.</p>
        </div>
      </Card>
    </form>
  );
}