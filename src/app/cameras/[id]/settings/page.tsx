'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCamera } from '@/lib/hooks/useCameras';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CameraSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  
  const { data: camera, isLoading, error } = useCamera(cameraId);

  const handleSaveSettings = async () => {
    try {
      // Implement settings save logic here
      toast.success('Camera settings saved successfully');
    } catch (error) {
      toast.error('Failed to save camera settings');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={40} width={200} />
        <Skeleton height={400} />
      </div>
    );
  }

  if (error || !camera) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          {error ? 'Error loading camera settings' : 'Camera not found'}
        </p>
        <Button onClick={() => router.push('/cameras')}>
          Back to Cameras
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/cameras/${cameraId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Camera
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-6">Camera Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera Name
                </label>
                <input
                  type="text"
                  defaultValue={camera.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={camera.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Stream Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Width
                </label>
                <input
                  type="number"
                  defaultValue={camera.stream_frame_width}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Height
                </label>
                <input
                  type="number"
                  defaultValue={camera.stream_frame_height}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FPS
                </label>
                <input
                  type="number"
                  defaultValue={camera.stream_fps}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Demographics Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detection Interval (seconds)
                </label>
                <input
                  type="number"
                  defaultValue={camera.demographics_config?.detection_interval}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Confidence (%)
                </label>
                <input
                  type="number"
                  defaultValue={camera.demographics_config?.min_confidence}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 