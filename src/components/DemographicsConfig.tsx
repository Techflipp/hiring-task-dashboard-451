"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiRefreshCw } from 'react-icons/fi'; // تم تصحيح الخطأ هنا
import { createDemographicsConfig, updateDemographicsConfig } from '@/lib/api';
import type { DemographicsConfig } from '@/lib/types';

interface DemographicsConfigProps {
  cameraId: string;
  initialConfig?: DemographicsConfig;
}

const DemographicsConfig: React.FC<DemographicsConfigProps> = ({ 
  cameraId, 
  initialConfig 
}) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<DemographicsConfig>({
    defaultValues: initialConfig || {
      camera_id: cameraId,
      track_history_max_length: 30,
      exit_threshold: 60,
      min_track_duration: 5,
      detection_confidence_threshold: 0.7,
      demographics_confidence_threshold: 0.8,
      min_track_updates: 10,
      box_area_threshold: 0.2,
      save_interval: 600,
      frame_skip_interval: 1.0
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: DemographicsConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // تم إصلاح المشكلة هنا باستخدام optional chaining
      if (initialConfig?.id) {
        await updateDemographicsConfig(initialConfig.id, data);
      } else {
        await createDemographicsConfig(data);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save configuration. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Demographics Configuration</h2>
        <button
          onClick={() => reset()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FiRefreshCw className="mr-1" />
          Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          Configuration saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Track History Max Length
              <span className="text-xs text-gray-500 ml-1">(1-100)</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('track_history_max_length', { 
                required: 'This field is required',
                min: { value: 1, message: 'Value must be at least 1' },
                max: { value: 100, message: 'Value must be at most 100' }
              })}
            />
            {errors.track_history_max_length && (
              <p className="mt-1 text-sm text-red-600">{errors.track_history_max_length.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exit Threshold
              <span className="text-xs text-gray-500 ml-1">(1-300)</span>
            </label>
            <input
              type="number"
              min="1"
              max="300"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('exit_threshold', { 
                required: 'This field is required',
                min: { value: 1, message: 'Value must be at least 1' },
                max: { value: 300, message: 'Value must be at most 300' }
              })}
            />
            {errors.exit_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.exit_threshold.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Track Duration
              <span className="text-xs text-gray-500 ml-1">(1-60)</span>
            </label>
            <input
              type="number"
              min="1"
              max="60"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('min_track_duration', { 
                required: 'This field is required',
                min: { value: 1, message: 'Value must be at least 1' },
                max: { value: 60, message: 'Value must be at most 60' }
              })}
            />
            {errors.min_track_duration && (
              <p className="mt-1 text-sm text-red-600">{errors.min_track_duration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detection Confidence
              <span className="text-xs text-gray-500 ml-1">(0.1-1.0)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="1.0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('detection_confidence_threshold', { 
                required: 'This field is required',
                min: { value: 0.1, message: 'Value must be at least 0.1' },
                max: { value: 1.0, message: 'Value must be at most 1.0' }
              })}
            />
            {errors.detection_confidence_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.detection_confidence_threshold.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demographics Confidence
              <span className="text-xs text-gray-500 ml-1">(0.1-1.0)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="1.0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('demographics_confidence_threshold', { 
                required: 'This field is required',
                min: { value: 0.1, message: 'Value must be at least 0.1' },
                max: { value: 1.0, message: 'Value must be at most 1.0' }
              })}
            />
            {errors.demographics_confidence_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.demographics_confidence_threshold.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Track Updates
              <span className="text-xs text-gray-500 ml-1">(1-100)</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('min_track_updates', { 
                required: 'This field is required',
                min: { value: 1, message: 'Value must be at least 1' },
                max: { value: 100, message: 'Value must be at most 100' }
              })}
            />
            {errors.min_track_updates && (
              <p className="mt-1 text-sm text-red-600">{errors.min_track_updates.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Area Threshold
              <span className="text-xs text-gray-500 ml-1">(0.05-1.0)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.05"
              max="1.0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('box_area_threshold', { 
                required: 'This field is required',
                min: { value: 0.05, message: 'Value must be at least 0.05' },
                max: { value: 1.0, message: 'Value must be at most 1.0' }
              })}
            />
            {errors.box_area_threshold && (
              <p className="mt-1 text-sm text-red-600">{errors.box_area_threshold.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Save Interval
              <span className="text-xs text-gray-500 ml-1">(300-1800)</span>
            </label>
            <input
              type="number"
              min="300"
              max="1800"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('save_interval', { 
                required: 'This field is required',
                min: { value: 300, message: 'Value must be at least 300' },
                max: { value: 1800, message: 'Value must be at most 1800' }
              })}
            />
            {errors.save_interval && (
              <p className="mt-1 text-sm text-red-600">{errors.save_interval.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frame Skip Interval
              <span className="text-xs text-gray-500 ml-1">(0.1-5.0)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="5.0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('frame_skip_interval', { 
                required: 'This field is required',
                min: { value: 0.1, message: 'Value must be at least 0.1' },
                max: { value: 5.0, message: 'Value must be at most 5.0' }
              })}
            />
            {errors.frame_skip_interval && (
              <p className="mt-1 text-sm text-red-600">{errors.frame_skip_interval.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className={`flex items-center px-6 py-2 rounded-md ${
              isLoading || !isDirty
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <FiSave className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemographicsConfig;