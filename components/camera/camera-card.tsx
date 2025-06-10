import Link from 'next/link';
import { Camera } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Camera as CameraIcon, Settings, BarChart3, Edit } from 'lucide-react';

interface CameraCardProps {
  camera: Camera;
}

export function CameraCard({ camera }: CameraCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CameraIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{camera.name}</h3>
          <p className="text-sm text-gray-500 truncate">{camera.rtsp_url}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Resolution:</span>
          <span className="font-medium">
            {camera.stream_frame_width}x{camera.stream_frame_height}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">FPS:</span>
          <span className="font-medium">{camera.stream_fps || 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quality:</span>
          <span className="font-medium">{camera.stream_quality}%</span>
        </div>
      </div>

      {camera.tags && camera.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {camera.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Link href={`/cameras/${camera.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <CameraIcon className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        
        <Link href={`/cameras/${camera.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        
        <Link href={`/cameras/${camera.id}/demographics`}>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created: {new Date(camera.created_at).toLocaleDateString()}
          </span>
          {camera.demographics_config && (
            <Badge variant="default" className="text-xs">
              Demographics Enabled
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}