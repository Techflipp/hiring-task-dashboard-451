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
      <Card className="hover:shadow-xl transition-all duration-200 overflow-hidden h-[365px]">
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
          
          <div className="absolute top-2 right-2 group">
            <StatusBadge 
              status={camera.is_active ? 'active' : 'inactive'} 
              size="sm"
            />
            {/* Status Message Tooltip */}
            {!camera.is_active && camera.status_message && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs text-gray-800">{camera.status_message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{camera.name}</h3>
            <p className="text-sm text-gray-500 mt-1 truncate">RTSP: {camera.rtsp_url}</p>
          </div>

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