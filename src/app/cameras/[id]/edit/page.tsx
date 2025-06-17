'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useCamera, useUpdateCamera, useTags } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { UpdateCameraData } from '@/types/api';

export default function EditCameraPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;

  const { data: camera, isLoading: cameraLoading, error: cameraError } = useCamera(cameraId);
  const { data: tags } = useTags();
  const updateCameraMutation = useUpdateCamera();

  const [formData, setFormData] = useState<UpdateCameraData>({
    name: '',
    rtsp_url: '',
    stream_frame_width: undefined,
    stream_frame_height: undefined,
    stream_max_length: undefined,
    stream_quality: undefined,
    stream_fps: undefined,
    stream_skip_frames: undefined,
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when camera loads
  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        rtsp_url: camera.rtsp_url,
        stream_frame_width: camera.stream_frame_width,
        stream_frame_height: camera.stream_frame_height,
        stream_max_length: camera.stream_max_length,
        stream_quality: camera.stream_quality,
        stream_fps: camera.stream_fps,
        stream_skip_frames: camera.stream_skip_frames,
        tags: camera.tags?.map(tag => tag.id) || [],
      });
    }
  }, [camera]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Camera name is required';
    }

    if (!formData.rtsp_url.trim()) {
      newErrors.rtsp_url = 'RTSP URL is required';
    } else if (!formData.rtsp_url.startsWith('rtsp://')) {
      newErrors.rtsp_url = 'RTSP URL must start with rtsp://';
    }

    if (formData.stream_frame_width && (formData.stream_frame_width < 1 || formData.stream_frame_width > 2560)) {
      newErrors.stream_frame_width = 'Width must be between 1 and 2560';
    }

    if (formData.stream_frame_height && (formData.stream_frame_height < 1 || formData.stream_frame_height > 2560)) {
      newErrors.stream_frame_height = 'Height must be between 1 and 2560';
    }

    if (formData.stream_max_length && (formData.stream_max_length < 0 || formData.stream_max_length > 10000)) {
      newErrors.stream_max_length = 'Max length must be between 0 and 10000';
    }

    if (formData.stream_quality && (formData.stream_quality < 80 || formData.stream_quality > 100)) {
      newErrors.stream_quality = 'Quality must be between 80 and 100';
    }

    if (formData.stream_fps && (formData.stream_fps < 1 || formData.stream_fps > 120)) {
      newErrors.stream_fps = 'FPS must be between 1 and 120';
    }

    if (formData.stream_skip_frames && (formData.stream_skip_frames < 0 || formData.stream_skip_frames > 100)) {
      newErrors.stream_skip_frames = 'Skip frames must be between 0 and 100';
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
      await updateCameraMutation.mutateAsync({
        cameraId,
        data: formData,
      });
      router.push(`/cameras/${cameraId}`);
    } catch {
      setErrors({ submit: 'Failed to update camera. Please try again.' });
    }
  };

  if (cameraLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
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
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading camera</h1>
            <p className="mt-2 text-gray-800">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/cameras/${cameraId}`}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Camera Details
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Edit Camera</h1>
          <p className="mt-2 text-gray-800">
            Update camera settings and configuration
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Camera Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Camera Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={errors.name}
                  required
                />
                <Input
                  label="RTSP URL"
                  value={formData.rtsp_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, rtsp_url: e.target.value }))}
                  error={errors.rtsp_url}
                  placeholder="rtsp://..."
                  required
                />
              </div>

              {/* Stream Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stream Configuration</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="Frame Width"
                    type="number"
                    min="1"
                    max="2560"
                    value={formData.stream_frame_width || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_frame_width: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_frame_width}
                  />
                  <Input
                    label="Frame Height"
                    type="number"
                    min="1"
                    max="2560"
                    value={formData.stream_frame_height || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_frame_height: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_frame_height}
                  />
                  <Input
                    label="Max Length (seconds)"
                    type="number"
                    min="0"
                    max="10000"
                    value={formData.stream_max_length || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_max_length: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_max_length}
                  />
                  <Input
                    label="Quality (%)"
                    type="number"
                    min="80"
                    max="100"
                    value={formData.stream_quality || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_quality: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_quality}
                  />
                  <Input
                    label="FPS"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.stream_fps || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_fps: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_fps}
                  />
                  <Input
                    label="Skip Frames"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.stream_skip_frames || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stream_skip_frames: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    error={errors.stream_skip_frames}
                  />
                </div>
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.tags?.includes(tag.id) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                tags: [...(prev.tags || []), tag.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                tags: prev.tags?.filter(id => id !== tag.id) || []
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                <Button type="submit" isLoading={updateCameraMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
} 