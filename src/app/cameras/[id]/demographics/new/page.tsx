'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useCamera, useCreateDemographicsConfig } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { CreateDemographicsConfigData } from '@/types/api';

export default function CreateDemographicsConfigPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;

  const { data: camera, isLoading: cameraLoading, error: cameraError } = useCamera(cameraId);
  const createConfigMutation = useCreateDemographicsConfig();

  const [formData, setFormData] = useState<CreateDemographicsConfigData>({
    camera_id: cameraId,
    track_history_max_length: 50,
    exit_threshold: 30,
    min_track_duration: 5,
    detection_confidence_threshold: 0.5,
    demographics_confidence_threshold: 0.7,
    min_track_updates: 10,
    box_area_threshold: 0.1,
    save_interval: 600,
    frame_skip_interval: 1.0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.track_history_max_length && (formData.track_history_max_length < 1 || formData.track_history_max_length > 100)) {
      newErrors.track_history_max_length = 'Track history max length must be between 1 and 100';
    }

    if (formData.exit_threshold && (formData.exit_threshold < 1 || formData.exit_threshold > 300)) {
      newErrors.exit_threshold = 'Exit threshold must be between 1 and 300';
    }

    if (formData.min_track_duration && (formData.min_track_duration < 1 || formData.min_track_duration > 60)) {
      newErrors.min_track_duration = 'Min track duration must be between 1 and 60';
    }

    if (formData.detection_confidence_threshold && (formData.detection_confidence_threshold < 0.1 || formData.detection_confidence_threshold > 1.0)) {
      newErrors.detection_confidence_threshold = 'Detection confidence threshold must be between 0.1 and 1.0';
    }

    if (formData.demographics_confidence_threshold && (formData.demographics_confidence_threshold < 0.1 || formData.demographics_confidence_threshold > 1.0)) {
      newErrors.demographics_confidence_threshold = 'Demographics confidence threshold must be between 0.1 and 1.0';
    }

    if (formData.min_track_updates && (formData.min_track_updates < 1 || formData.min_track_updates > 100)) {
      newErrors.min_track_updates = 'Min track updates must be between 1 and 100';
    }

    if (formData.box_area_threshold && (formData.box_area_threshold < 0.05 || formData.box_area_threshold > 1.0)) {
      newErrors.box_area_threshold = 'Box area threshold must be between 0.05 and 1.0';
    }

    if (formData.save_interval && (formData.save_interval < 300 || formData.save_interval > 1800)) {
      newErrors.save_interval = 'Save interval must be between 300 and 1800';
    }

    if (formData.frame_skip_interval && (formData.frame_skip_interval < 0.1 || formData.frame_skip_interval > 5.0)) {
      newErrors.frame_skip_interval = 'Frame skip interval must be between 0.1 and 5.0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createConfigMutation.mutateAsync(formData);
      router.push(`/cameras/${cameraId}`);
    } catch {
      setErrors({ submit: 'Failed to create demographics configuration. Please try again.' });
    }
  };

  if (cameraLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cameraError || !camera) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading camera</h1>
            <p className="mt-2 text-gray-600">
              {cameraError?.message || 'Camera not found'}
            </p>
            <Link 
              href="/cameras"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-10 px-4 text-sm mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cameras
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (camera.demographics_config) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yellow-600">Configuration Already Exists</h1>
            <p className="mt-2 text-gray-600">
              This camera already has a demographics configuration.
            </p>
            <div className="mt-4 space-x-4">
              <Link 
                href={`/cameras/${cameraId}`}
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-10 px-4 text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Camera
              </Link>
              <Link 
                href={`/cameras/${cameraId}/demographics/edit`}
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
              >
                Edit Configuration
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/cameras/${cameraId}`}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Camera Details
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Create Demographics Configuration</h1>
          <p className="mt-2 text-gray-600">
            Configure demographics analytics for {camera.name}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Demographics Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tracking Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Configuration</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Track History Max Length"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.track_history_max_length || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      track_history_max_length: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.track_history_max_length}
                  />
                  <Input
                    label="Exit Threshold"
                    type="number"
                    min="1"
                    max="300"
                    value={formData.exit_threshold || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      exit_threshold: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.exit_threshold}
                  />
                  <Input
                    label="Min Track Duration"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.min_track_duration || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      min_track_duration: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.min_track_duration}
                  />
                  <Input
                    label="Min Track Updates"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.min_track_updates || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      min_track_updates: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.min_track_updates}
                  />
                </div>
              </div>

              {/* Detection Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detection Configuration</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Detection Confidence Threshold"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={formData.detection_confidence_threshold || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      detection_confidence_threshold: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.detection_confidence_threshold}
                  />
                  <Input
                    label="Demographics Confidence Threshold"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={formData.demographics_confidence_threshold || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      demographics_confidence_threshold: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.demographics_confidence_threshold}
                  />
                  <Input
                    label="Box Area Threshold"
                    type="number"
                    step="0.01"
                    min="0.05"
                    max="1.0"
                    value={formData.box_area_threshold || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      box_area_threshold: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.box_area_threshold}
                  />
                </div>
              </div>

              {/* Processing Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Configuration</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Save Interval (seconds)"
                    type="number"
                    min="300"
                    max="1800"
                    value={formData.save_interval || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      save_interval: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.save_interval}
                  />
                  <Input
                    label="Frame Skip Interval"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={formData.frame_skip_interval || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      frame_skip_interval: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.frame_skip_interval}
                  />
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <Link 
                  href={`/cameras/${cameraId}`}
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500 h-10 px-4 text-sm"
                >
                  Cancel
                </Link>
                <Button type="submit" isLoading={createConfigMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Create Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
} 