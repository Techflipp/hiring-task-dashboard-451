import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Tag } from '@/lib/types';
import { useUpdateCamera } from '@/lib/hooks/useCameras';
import { useTags } from '@/lib/hooks/useTags';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

const updateCameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  rtsp_url: z.string().url('Must be a valid URL'),
  stream_frame_width: z.number().min(1).max(2560).optional().nullable(),
  stream_frame_height: z.number().min(1).max(2560).optional().nullable(),
  stream_max_length: z.number().min(0).max(10000).optional().nullable(),
  stream_quality: z.number().min(80).max(100).optional().nullable(),
  stream_fps: z.number().min(1).max(120).optional().nullable(),
  stream_skip_frames: z.number().min(0).max(100).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

type UpdateCameraFormData = z.infer<typeof updateCameraSchema>;

interface CameraUpdateFormProps {
  camera: Camera;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CameraUpdateForm: React.FC<CameraUpdateFormProps> = ({
  camera,
  onCancel,
  onSuccess,
}) => {
  const { data: availableTags } = useTags();
  const updateCamera = useUpdateCamera();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    camera.tags?.map(tag => tag.id) || []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateCameraFormData>({
    resolver: zodResolver(updateCameraSchema),
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width || null,
      stream_frame_height: camera.stream_frame_height || null,
      stream_max_length: camera.stream_max_length || null,
      stream_quality: camera.stream_quality || null,
      stream_fps: camera.stream_fps || null,
      stream_skip_frames: camera.stream_skip_frames || null,
      tags: camera.tags?.map((tag) => tag.id) || [],
    },
  });

  const onSubmit = async (data: UpdateCameraFormData) => {
    try {
      const cleanedData = {
        ...data,
        stream_frame_width: data.stream_frame_width || undefined,
        stream_frame_height: data.stream_frame_height || undefined,
        stream_max_length: data.stream_max_length || undefined,
        stream_quality: data.stream_quality || undefined,
        stream_fps: data.stream_fps || undefined,
        stream_skip_frames: data.stream_skip_frames || undefined,
        tags: selectedTags,
      };
      
      await updateCamera.mutateAsync({ id: camera.id, data: cleanedData });
      onSuccess();
    } catch (error) {
      console.error('Failed to update camera:', error);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getTagById = (tagId: string): Tag | undefined => {
    return availableTags?.find(tag => tag.id === tagId);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Camera Name"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="RTSP URL"
            {...register('rtsp_url')}
            error={errors.rtsp_url?.message}
          />
          <Input
            label="Frame Width"
            type="number"
            {...register('stream_frame_width', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_frame_width?.message}
          />
          <Input
            label="Frame Height"
            type="number"
            {...register('stream_frame_height', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_frame_height?.message}
          />
          <Input
            label="Max Stream Length (seconds)"
            type="number"
            {...register('stream_max_length', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_max_length?.message}
          />
          <Input
            label="Stream Quality (%)"
            type="number"
            {...register('stream_quality', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_quality?.message}
          />
          <Input
            label="Frame Rate (FPS)"
            type="number"
            {...register('stream_fps', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_fps?.message}
          />
          <Input
            label="Skip Frames"
            type="number"
            {...register('stream_skip_frames', { 
              setValueAs: v => v === '' ? null : parseInt(v, 10) 
            })}
            error={errors.stream_skip_frames?.message}
          />
        </div>

        {availableTags && availableTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = getTagById(tagId);
                  return tag ? (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 text-sm text-white rounded-full"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className="ml-2 hover:opacity-80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
            
            {/* Available Tags */}
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !selectedTags.includes(tag.id))
                .map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className="px-3 py-1 text-sm border-2 rounded-full hover:opacity-80 transition-opacity"
                    style={{ 
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                  >
                    + {tag.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateCamera.isPending}>
            Update Camera
          </Button>
        </div>
      </form>
    </Card>
  );
};