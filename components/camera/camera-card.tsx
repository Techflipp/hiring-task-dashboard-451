import Link from 'next/link';
import { Camera } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Camera as CameraIcon, BarChart3, Edit, AlertCircle, CheckCircle, XCircle, Image, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';

interface CameraCardProps {
  camera: Camera;
}

export function CameraCard({ camera }: CameraCardProps) {
  // Fetch detailed camera data
  const { data: detailedCamera, isLoading, error } = useQuery({
    queryKey: ['camera', camera.id],
    queryFn: () => apiClient.getCamera(camera.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });

  // Merge camera list data with detailed data
  const mergedCamera = detailedCamera ? { ...camera, ...detailedCamera } : camera;
  console.log(mergedCamera)

  const getStatusIcon = () => {
    if (mergedCamera.is_active) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (mergedCamera.is_active) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header with camera info and status */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CameraIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{mergedCamera.name}</h3>
            {getStatusIcon()}
          </div>
          <p className="text-sm text-gray-500 truncate">{mergedCamera.rtsp_url}</p>
        </div>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Status message */}
      {mergedCamera.status_message && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <div className="flex items-center gap-2">
            {!mergedCamera.is_active && <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
            <span className={mergedCamera.is_active ? 'text-green-700' : 'text-amber-700'}>
              {mergedCamera.status_message}
            </span>
          </div>
        </div>
      )}

      {/* Camera snapshot if available */}
      {mergedCamera.snapshot && (
        <div className="mb-3">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={mergedCamera.snapshot} 
              alt={`${mergedCamera.name} snapshot`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex items-center justify-center h-full text-gray-400">
                      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                <Image className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Camera specifications */}
      <div className="space-y-2 mb-4">
        {/* Show detailed specs if available from detailed API */}
        {mergedCamera.stream_frame_width && mergedCamera.stream_frame_height ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resolution:</span>
            <span className="font-medium">
              {mergedCamera.stream_frame_width}x{mergedCamera.stream_frame_height}
            </span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Resolution:</span>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : null}
        
        {mergedCamera.stream_fps ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">FPS:</span>
            <span className="font-medium">{mergedCamera.stream_fps}</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">FPS:</span>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : null}
        
        {mergedCamera.stream_quality ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quality:</span>
            <span className="font-medium">{mergedCamera.stream_quality}%</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quality:</span>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : null}

        {/* Always show status */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          {getStatusBadge()}
        </div>
        
        {/* Show last updated */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Updated:</span>
          <span className="font-medium text-xs">
            {new Date(mergedCamera.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tags */}
      {mergedCamera.tags && mergedCamera.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {mergedCamera.tags.slice(0, 4).map((tag) => (
              <Badge 
                key={tag.id} 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: tag.color + '20', 
                  borderColor: tag.color + '40',
                  color: tag.color 
                }}
              >
                {tag.name}
              </Badge>
            ))}
            {mergedCamera.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{mergedCamera.tags.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mb-3">
        <Link href={`/cameras/${mergedCamera.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <CameraIcon className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        
        <Link href={`/cameras/${mergedCamera.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        
        <Link href={`/cameras/${mergedCamera.id}/demographics`}>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Footer with metadata */}
      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created: {new Date(mergedCamera.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            {/* Show demographics badge based on detailed data */}
            {mergedCamera.demographics_config ? (
              <Badge variant="default" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                Demographics Enabled
              </Badge>
            ) : detailedCamera && !isLoading ? (
              <Badge variant="outline" className="text-xs">
                Demographics Disabled
              </Badge>
            ) : isLoading ? (
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          Failed to load camera details
        </div>
      )}
    </Card>
  );
}