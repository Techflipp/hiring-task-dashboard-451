import React from 'react';
import { Camera } from '@/lib/types';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { TagList } from '../ui/TagList';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '../ui/SafeImage';

interface CameraCardProps {
  camera: Camera;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {

  return (
    <Link href={`/cameras/${camera.id}`}>
      <Card className="hover:shadow-xl transition-all duration-200 overflow-hidden">
        {/* Camera Snapshot */}
        <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-gray-100">
          <SafeImage
            src={camera.snapshot}
            alt={camera.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          <div className="absolute top-2 right-2">
            <StatusBadge 
              status={camera.is_active ? 'active' : 'inactive'} 
              size="sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
            <p className="text-sm text-gray-500 mt-1 truncate">RTSP: {camera.rtsp_url}</p>
          </div>

          {/* Status Message */}
          {!camera.is_active && camera.status_message && (
            <div className="flex items-start space-x-2 p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800">{camera.status_message}</p>
            </div>
          )}

          {/* Camera Info */}
          {camera.stream_frame_width && camera.stream_frame_height && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{camera.stream_frame_width}x{camera.stream_frame_height}</span>
              {camera.stream_fps && <span>{camera.stream_fps} FPS</span>}
              {camera.stream_quality && <span>Quality: {camera.stream_quality}%</span>}
            </div>
          )}

          {/* Tags using TagList component */}
          {camera.tags && camera.tags.length > 0 && (
            <TagList tags={camera.tags} maxVisible={3} size="sm" />
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-gray-500">
              Updated: {new Date(camera.updated_at).toLocaleDateString()}
            </div>
            {camera.demographics_config && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Demographics Active
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};