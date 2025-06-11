import { Camera } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  Monitor, 
  Settings, 
  Camera as CameraIcon,
  Activity,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface CameraDetailProps {
  camera: Camera;
}

export function CameraDetail({ camera }: CameraDetailProps) {
  const getStatusIcon = () => {
    if (camera.is_active) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (camera.is_active) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camera Name
                </label>
                <p className="text-gray-900 font-medium">{camera.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RTSP URL
                </label>
                <p className="text-gray-900 break-all font-mono text-sm bg-gray-50 p-2 rounded">
                  {camera.rtsp_url}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  {getStatusBadge()}
                </div>
              </div>
              
              {camera.status_message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Message
                  </label>
                  <div className="flex items-center gap-2">
                    {!camera.is_active && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <p className={`text-sm ${camera.is_active ? 'text-green-700' : 'text-amber-700'}`}>
                      {camera.status_message}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Camera Snapshot */}
            {camera.snapshot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Snapshot
                </label>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                  <img 
                    src={camera.snapshot} 
                    alt={`${camera.name} snapshot`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex items-center justify-center h-full text-gray-400">
                            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white border-0">
                      <Image className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Stream Configuration */}
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
              <p className="text-gray-900 font-semibold">
                {camera.stream_frame_width}×{camera.stream_frame_height}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality
              </label>
              <p className="text-gray-900 font-semibold">{camera.stream_quality}%</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FPS
              </label>
              <p className="text-gray-900 font-semibold">{camera.stream_fps}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skip Frames
              </label>
              <p className="text-gray-900 font-semibold">{camera.stream_skip_frames || 0}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Stream Length
            </label>
            <p className="text-gray-900 font-semibold">{camera.stream_max_length} seconds</p>
          </div>
        </Card>

        {/* Demographics Configuration */}
        {camera.demographics_config && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Demographics Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Tracking</h4>
                <div>
                  <span className="text-gray-600 text-sm">Track History Max:</span>
                  <p className="font-semibold">{camera.demographics_config.track_history_max_length}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Min Track Duration:</span>
                  <p className="font-semibold">{camera.demographics_config.min_track_duration}s</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Min Track Updates:</span>
                  <p className="font-semibold">{camera.demographics_config.min_track_updates}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Exit Threshold:</span>
                  <p className="font-semibold">{camera.demographics_config.exit_threshold}s</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Detection</h4>
                <div>
                  <span className="text-gray-600 text-sm">Detection Confidence:</span>
                  <p className="font-semibold">{camera.demographics_config.detection_confidence_threshold}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Demographics Confidence:</span>
                  <p className="font-semibold">{camera.demographics_config.demographics_confidence_threshold}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Box Area Threshold:</span>
                  <p className="font-semibold">{camera.demographics_config.box_area_threshold}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Processing</h4>
                <div>
                  <span className="text-gray-600 text-sm">Save Interval:</span>
                  <p className="font-semibold">{camera.demographics_config.save_interval}s</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Frame Skip Interval:</span>
                  <p className="font-semibold">{camera.demographics_config.frame_skip_interval}s</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Config ID: {camera.demographics_config.id}</span>
                <span>Updated: {new Date(camera.demographics_config.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status Overview
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connection:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                {getStatusBadge()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Demographics:</span>
              <Badge variant={camera.demographics_config ? "default" : "secondary"} className={
                camera.demographics_config 
                  ? "bg-purple-100 text-purple-800 border-purple-200" 
                  : ""
              }>
                {camera.demographics_config ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tags:</span>
              <Badge variant="outline">
                {camera.tags?.length || 0} assigned
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          
          {camera.tags && camera.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {camera.tags.map(tag => (
                <Badge 
                  key={tag.id} 
                  variant="secondary"
                  style={{ 
                    backgroundColor: tag.color + '20', 
                    borderColor: tag.color + '40',
                    color: tag.color 
                  }}
                  className="font-medium"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tags assigned</p>
          )}
        </Card>

        {/* Timestamps */}
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
            
            {camera.demographics_config && (
              <div className="pt-2 border-t">
                <span className="text-gray-600">Demographics Config Updated:</span>
                <p className="font-medium">
                  {new Date(camera.demographics_config.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Camera Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CameraIcon className="h-4 w-4" />
            Camera Info
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Camera ID:</span>
              <p className="font-mono text-xs bg-gray-50 p-1 rounded mt-1 break-all">
                {camera.id}
              </p>
            </div>
            
            <div>
              <span className="text-gray-600">Stream URL:</span>
              <p className="font-mono text-xs bg-gray-50 p-1 rounded mt-1 break-all">
                {camera.rtsp_url}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}