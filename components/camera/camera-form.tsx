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
import { X } from 'lucide-react';

const cameraSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rtsp_url: z.string().url('Invalid RTSP URL'),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
});

type CameraFormData = z.infer<typeof cameraSchema>;

interface CameraFormProps {
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
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: camera ? {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width,
      stream_frame_height: camera.stream_frame_height,
      stream_max_length: camera.stream_max_length,
      stream_quality: camera.stream_quality,
      stream_fps: camera.stream_fps,
      stream_skip_frames: camera.stream_skip_frames,
    } : {
      stream_quality: 90,
      stream_fps: 30,
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

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Camera Name *
            </label>
            <Input
              {...register('name')}
              placeholder="Enter camera name"
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
              placeholder="rtsp://example.com/stream"
              className={errors.rtsp_url ? 'border-red-500' : ''}
            />
            {errors.rtsp_url && (
              <p className="mt-1 text-sm text-red-600">{errors.rtsp_url.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Width
            </label>
            <Input
              type="number"
              {...register('stream_frame_width', { valueAsNumber: true })}
              placeholder="1920"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Height
            </label>
            <Input
              type="number"
              {...register('stream_frame_height', { valueAsNumber: true })}
              placeholder="1080"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality (%)
            </label>
            <Input
              type="number"
              {...register('stream_quality', { valueAsNumber: true })}
              min="80"
              max="100"
              placeholder="90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FPS
            </label>
            <Input
              type="number"
              {...register('stream_fps', { valueAsNumber: true })}
              min="1"
              max="120"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map(tagId => {
                const tag = availableTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
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
          )}

          <div className="relative">
            <Input
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags to add..."
            />
            
            {tagSearch && filteredTags.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag.id)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : camera ? 'Update Camera' : 'Create Camera'}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}