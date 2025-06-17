'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Edit, 
  Settings, 
  Camera as CameraIcon,
  BarChart3,
  Tag as TagIcon,
  Info,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Monitor,
  Trash2
} from 'lucide-react';
import { useCamera, useDeleteDemographicsConfig } from '@/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import { formatDate } from '@/lib/utils';

export default function CameraDetailPage() {
  const params = useParams();
  const cameraId = params.id as string;
  const [activeTab, setActiveTab] = useState<'details' | 'config' | 'analytics'>('details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: camera, isLoading, error } = useCamera(cameraId);
  const deleteConfigMutation = useDeleteDemographicsConfig();

  const handleDeleteConfig = async () => {
    if (!camera?.demographics_config) return;
    
    try {
      await deleteConfigMutation.mutateAsync(camera.demographics_config.id);
      setShowDeleteConfirm(false);
      // The query will be invalidated automatically by the mutation
    } catch (error) {
      console.error('Failed to delete demographics configuration:', error);
    }
  };

  const tabs = [
    { id: 'details' as const, name: 'Details', icon: Info },
    { id: 'config' as const, name: 'Demographics Config', icon: Settings },
    { id: 'analytics' as const, name: 'Analytics', icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !camera) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading camera</h1>
            <p className="mt-2 text-gray-600">
              {error?.message || 'Camera not found'}
            </p>
            <Link 
              href="/cameras"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cameras
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/cameras"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cameras
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CameraIcon className="h-8 w-8 text-blue-600" />
                {camera.name}
                <div className="flex items-center gap-2">
                  {camera.is_active ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </h1>
              <p className="mt-2 text-gray-600">
                Created {formatDate(camera.created_at)} • Last updated {formatDate(camera.updated_at)}
              </p>
              {camera.status_message && (
                <p className="mt-1 text-sm text-gray-500">{camera.status_message}</p>
              )}
            </div>
            <Link 
              href={`/cameras/${camera.id}/edit`}
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Camera
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 py-2 px-1 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Camera Snapshot */}
            {camera.snapshot && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                    Camera Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={camera.snapshot}
                      alt={`${camera.name} snapshot`}
                      className="h-full w-full object-contain"
                      width={800}
                      height={256}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Camera Name</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Camera ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{camera.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`h-2 w-2 rounded-full ${
                        camera.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm ${
                        camera.is_active ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {camera.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {camera.status_message && (
                      <p className="text-xs text-gray-500 mt-1">{camera.status_message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">RTSP URL</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded break-all">
                      {camera.rtsp_url}
                    </p>
                  </div>
                  {camera.tags && camera.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {camera.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: tag.color + '20',
                              color: tag.color 
                            }}
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    Stream Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Resolution</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.stream_frame_width} × {camera.stream_frame_height} pixels
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Frame Rate</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_fps} FPS</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stream Quality</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_quality}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Max Stream Length</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.stream_max_length === 0 ? 'Unlimited' : `${camera.stream_max_length} frames`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Skip Frames</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_skip_frames}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div>
            {camera.demographics_config ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Demographics Configuration</span>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/cameras/${camera.id}/demographics/edit`}
                        className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm"
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        disabled={deleteConfigMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Track History Max Length</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.track_history_max_length || 'Default'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Exit Threshold</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.exit_threshold || 'Default'} seconds</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Min Track Duration</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.min_track_duration || 'Default'} seconds</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Detection Confidence</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.detection_confidence_threshold || 'Default'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Demographics Confidence</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.demographics_confidence_threshold || 'Default'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Min Track Updates</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.min_track_updates || 'Default'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Box Area Threshold</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.box_area_threshold || 'Default'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Save Interval</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.save_interval || 'Default'} seconds</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Frame Skip Interval</label>
                      <p className="mt-1 text-sm text-gray-900">{camera.demographics_config.frame_skip_interval || 'Default'} seconds</p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500">
                      Configuration created: {formatDate(camera.demographics_config.created_at)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(camera.demographics_config.updated_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Demographics Configuration</h3>
                  <p className="text-gray-600 mb-6">
                    This camera doesn&apos;t have a demographics configuration yet. Create one to enable analytics.
                  </p>
                  <Link 
                    href={`/cameras/${camera.id}/demographics/new`}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Create Configuration
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4">
                  <CardHeader>
                    <CardTitle className="text-red-600">Delete Demographics Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete the demographics configuration? This action cannot be undone and will disable analytics for this camera.
                    </p>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleteConfigMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDeleteConfig}
                        disabled={deleteConfigMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {deleteConfigMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            {camera.demographics_config ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">View Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    Explore detailed demographics analytics for this camera.
                  </p>
                  <Link 
                    href={`/analytics?camera_id=${camera.id}`}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Unavailable</h3>
                  <p className="text-gray-600 mb-6">
                    To view analytics, you need to create a demographics configuration first.
                  </p>
                  <Link 
                    href={`/cameras/${camera.id}/demographics/new`}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Enable Analytics
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 