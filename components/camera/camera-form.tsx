'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Tag } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, Camera as CameraIcon, Settings, Tag as TagIcon, Info } from 'lucide-react';

const cameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required').max(100, 'Name must be less than 100 characters'),
  rtsp_url: z.string().min(1, 'RTSP URL is required').refine(
    (url) => url.startsWith('rtsp://') || url.startsWith('rtmps://'),
    'Must be a valid RTSP URL (rtsp:// or rtmps://)'
  ),
  stream_frame_width: z.number()
    .min(320, 'Minimum width is 320px')
    .max(4096, 'Maximum width is 4096px')
    .int('Must be a whole number'),
  stream_frame_height: z.number()
    .min(240, 'Minimum height is 240px') 
    .max(2160, 'Maximum height is 2160px')
    .int('Must be a whole number'),
  stream_max_length: z.number()
    .min(0, 'Must be 0 or greater')
    .max(86400, 'Maximum is 24 hours (86400 seconds)'),
  stream_quality: z.number()
    .min(1, 'Minimum quality is 1%')
    .max(100, 'Maximum quality is 100%')
    .int('Must be a whole number'),
  stream_fps: z.number()
    .min(1, 'Minimum FPS is 1')
    .max(120, 'Maximum FPS is 120')
    .int('Must be a whole number'),
  stream_skip_frames: z.number()
    .min(0, 'Must be 0 or greater')
    .max(30, 'Maximum skip frames is 30')
    .int('Must be a whole number'),
});

type CameraFormData = z.infer<typeof cameraSchema>;

export interface CameraFormProps {
  camera?: Camera;
  availableTags: Tag[];
  onSubmit: (data: CameraFormData & { tags: string[] }) => Promise<void>;
  isLoading?: boolean;
}

export function CameraForm({ camera, availableTags, onSubmit, isLoading }: CameraFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    camera?.tags?.map(tag => tag.id) || []
  );
  const [tagSearch, setTagSearch] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: camera ? {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width || 1920,
      stream_frame_height: camera.stream_frame_height || 1080,
      stream_max_length: camera.stream_max_length || 3600,
      stream_quality: camera.stream_quality || 90,
      stream_fps: camera.stream_fps || 30,
      stream_skip_frames: camera.stream_skip_frames || 0,
    } : {
      name: '',
      rtsp_url: '',
      stream_frame_width: 1920,
      stream_frame_height: 1080,
      stream_max_length: 3600,
      stream_quality: 90,
      stream_fps: 30,
      stream_skip_frames: 0,
    },
  });

  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  const addTag = (tagId: string) => {
    setSelectedTags(prev => [...prev, tagId]);
    setTagSearch('');
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  const onFormSubmit = async (data: CameraFormData) => {
    await onSubmit({ ...data, tags: selectedTags });
  };

  // Calculate estimated resolution
  const frameWidth = watch('stream_frame_width');
  const frameHeight = watch('stream_frame_height');
  const getResolutionLabel = () => {
    if (frameWidth === 1920 && frameHeight === 1080) return '1080p (Full HD)';
    if (frameWidth === 1280 && frameHeight === 720) return '720p (HD)';
    if (frameWidth === 3840 && frameHeight === 2160) return '4K (Ultra HD)';
    if (frameWidth === 640 && frameHeight === 480) return '480p (SD)';
    return 'Custom Resolution';
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CameraIcon className="h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera Name *
              </label>
              <Input
                {...register('name')}
                placeholder="Enter camera name (e.g., Main Entrance Camera)"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RTSP URL *
              </label>
              <Input
                {...register('rtsp_url')}
                placeholder="rtsp://camera.local:554/stream"
                className={errors.rtsp_url ? 'border-red-500' : ''}
              />
              {errors.rtsp_url && (
                <p className="mt-1 text-sm text-red-600">{errors.rtsp_url.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must start with rtsp:// or rtmps://
              </p>
            </div>
          </div>
        </Card>

        {/* Stream Configuration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Stream Configuration
          </h3>
          
          {/* Resolution */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Video Resolution</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Width (px) *
                </label>
                <Input
                  type="number"
                  {...register('stream_frame_width', { valueAsNumber: true })}
                  placeholder="1920"
                  min="320"
                  max="4096"
                  className={errors.stream_frame_width ? 'border-red-500' : ''}
                />
                {errors.stream_frame_width && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_frame_width.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Height (px) *
                </label>
                <Input
                  type="number"
                  {...register('stream_frame_height', { valueAsNumber: true })}
                  placeholder="1080"
                  min="240"
                  max="2160"
                  className={errors.stream_frame_height ? 'border-red-500' : ''}
                />
                {errors.stream_frame_height && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_frame_height.message}</p>
                )}
              </div>
            </div>
            
            {frameWidth && frameHeight && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <Info className="h-4 w-4 inline mr-1" />
                <strong>Resolution:</strong> {getResolutionLabel()} ({frameWidth}×{frameHeight})
              </div>
            )}
          </div>

          {/* Quality and Performance */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Quality & Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stream Quality (%) *
                </label>
                <Input
                  type="number"
                  {...register('stream_quality', { valueAsNumber: true })}
                  min="1"
                  max="100"
                  placeholder="90"
                  className={errors.stream_quality ? 'border-red-500' : ''}
                />
                {errors.stream_quality && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_quality.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">1-100% (higher = better quality)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frames Per Second *
                </label>
                <Input
                  type="number"
                  {...register('stream_fps', { valueAsNumber: true })}
                  min="1"
                  max="120"
                  placeholder="30"
                  className={errors.stream_fps ? 'border-red-500' : ''}
                />
                {errors.stream_fps && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_fps.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">1-120 FPS (30 is standard)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skip Frames *
                </label>
                <Input
                  type="number"
                  {...register('stream_skip_frames', { valueAsNumber: true })}
                  min="0"
                  max="30"
                  placeholder="0"
                  className={errors.stream_skip_frames ? 'border-red-500' : ''}
                />
                {errors.stream_skip_frames && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_skip_frames.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">0-30 frames (0 = no skipping)</p>
              </div>
            </div>
          </div>

          {/* Stream Duration */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Stream Duration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Stream Length (seconds) *
                </label>
                <Input
                  type="number"
                  {...register('stream_max_length', { valueAsNumber: true })}
                  min="0"
                  max="86400"
                  placeholder="3600"
                  className={errors.stream_max_length ? 'border-red-500' : ''}
                />
                {errors.stream_max_length && (
                  <p className="mt-1 text-sm text-red-600">{errors.stream_max_length.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  0 = unlimited, 3600 = 1 hour, 86400 = 24 hours
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Tags ({selectedTags.length})
          </h3>
          
          {selectedTags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tagId => {
                  const tag = availableTags.find(t => t.id === tagId);
                  return tag ? (
                    <Badge 
                      key={tagId} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                      style={{ 
                        backgroundColor: tag.color + '20', 
                        borderColor: tag.color + '40',
                        color: tag.color 
                      }}
                    >
                      {tag.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tagId)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Tags
            </label>
            <Input
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Type to search and add tags..."
            />
            
            {tagSearch && filteredTags.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </button>
                ))}
              </div>
            )}
            
          {tagSearch && filteredTags.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500">
              No tags found matching &quot;{tagSearch}&quot;
            </div>
          )}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            Tags help categorize and filter cameras. Type to search from {availableTags.length} available tags.
          </p>
        </Card>

        {/* Form Actions */}
        <Card className="p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 sm:flex-none sm:min-w-32"
            >
              {isLoading 
                ? (camera ? 'Updating...' : 'Creating...')
                : (camera ? 'Update Camera' : 'Create Camera')
              }
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.history.back()}
              disabled={isLoading}
              className="flex-1 sm:flex-none sm:min-w-24"
            >
              Cancel
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p><strong>Required fields:</strong> Camera name, RTSP URL, and all stream configuration values</p>
            <p><strong>Note:</strong> Changes will be applied immediately after saving</p>
          </div>
        </Card>
      </form>
    </div>
  );
}

// Default export for compatibility
export default CameraForm;