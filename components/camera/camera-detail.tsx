import { Camera } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Link as LinkIcon, Monitor, Settings } from 'lucide-react';

interface CameraDetailProps {
  camera: Camera;
}

export function CameraDetail({ camera }: CameraDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Camera Name
              </label>
              <p className="text-gray-900">{camera.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RTSP URL
              </label>
              <p className="text-gray-900 break-all">{camera.rtsp_url}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Stream Configuration
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <p className="text-gray-900">
                {camera.stream_frame_width}×{camera.stream_frame_height}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality
              </label>
              <p className="text-gray-900">{camera.stream_quality}%</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FPS
              </label>
              <p className="text-gray-900">{camera.stream_fps}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skip Frames
              </label>
              <p className="text-gray-900">{camera.stream_skip_frames || 0}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Stream Length
            </label>
            <p className="text-gray-900">{camera.stream_max_length} seconds</p>
          </div>
        </Card>

        {camera.demographics_config && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Demographics Configuration</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Track History Max:</span>
                <p className="font-medium">{camera.demographics_config.track_history_max_length}</p>
              </div>
              <div>
                <span className="text-gray-600">Exit Threshold:</span>
                <p className="font-medium">{camera.demographics_config.exit_threshold}s</p>
              </div>
              <div>
                <span className="text-gray-600">Min Track Duration:</span>
                <p className="font-medium">{camera.demographics_config.min_track_duration}s</p>
              </div>
              <div>
                <span className="text-gray-600">Detection Confidence:</span>
                <p className="font-medium">{camera.demographics_config.detection_confidence_threshold}</p>
              </div>
              <div>
                <span className="text-gray-600">Demographics Confidence:</span>
                <p className="font-medium">{camera.demographics_config.demographics_confidence_threshold}</p>
              </div>
              <div>
                <span className="text-gray-600">Save Interval:</span>
                <p className="font-medium">{camera.demographics_config.save_interval}s</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          
          {camera.tags && camera.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {camera.tags.map(tag => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tags assigned</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timestamps
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Created:</span>
              <p className="font-medium">
                {new Date(camera.created_at).toLocaleString()}
              </p>
            </div>
            
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-medium">
                {new Date(camera.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Demographics:</span>
              <Badge variant={camera.demographics_config ? "default" : "secondary"}>
                {camera.demographics_config ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stream Status:</span>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}