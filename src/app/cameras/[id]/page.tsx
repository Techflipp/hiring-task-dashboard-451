'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Settings, 
  Camera as CameraIcon,
  BarChart3,
  Tag as TagIcon,
  Info
} from 'lucide-react';
import { useCamera } from '@/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { formatDate } from '@/lib/utils';

export default function CameraDetailPage() {
  const params = useParams();
  const cameraId = params.id as string;
  const [activeTab, setActiveTab] = useState<'details' | 'config' | 'analytics'>('details');

  const { data: camera, isLoading, error } = useCamera(cameraId);

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
              </h1>
              <p className="mt-2 text-gray-600">
                Created {formatDate(camera.created_at)} • Last updated {formatDate(camera.updated_at)}
              </p>
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
                  <label className="text-sm font-medium text-gray-700">RTSP URL</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
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
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                <CardTitle>Stream Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {camera.stream_frame_width && camera.stream_frame_height && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Resolution</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.stream_frame_width} × {camera.stream_frame_height} pixels
                    </p>
                  </div>
                )}
                {camera.stream_fps && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Frame Rate</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_fps} FPS</p>
                  </div>
                )}
                {camera.stream_quality && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stream Quality</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_quality}%</p>
                  </div>
                )}
                {camera.stream_max_length && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Max Stream Length</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_max_length} seconds</p>
                  </div>
                )}
                {camera.stream_skip_frames && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Skip Frames</label>
                    <p className="mt-1 text-sm text-gray-900">{camera.stream_skip_frames}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'config' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Demographics Configuration
                {camera.demographics_config ? (
                  <Link 
                    href={`/cameras/${camera.id}/demographics/edit`}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Config
                  </Link>
                ) : (
                  <Link 
                    href={`/cameras/${camera.id}/demographics/new`}
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-8 px-3 text-sm"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Create Config
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {camera.demographics_config ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Track History Max Length</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.track_history_max_length || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Exit Threshold</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.exit_threshold || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Min Track Duration</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.min_track_duration || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Detection Confidence</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.detection_confidence_threshold || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Demographics Confidence</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.demographics_confidence_threshold || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Save Interval</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {camera.demographics_config.save_interval || 'Not set'}s
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No demographics configuration</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a demographics configuration to enable analytics for this camera.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href={`/cameras/${camera.id}/demographics/new`}
                      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Create Configuration
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Demographics Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {camera.demographics_config ? (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-blue-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View detailed demographics analytics for this camera.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href={`/analytics?camera_id=${camera.id}`}
                      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics not available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Demographics configuration is required to view analytics data.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href={`/cameras/${camera.id}/demographics/new`}
                      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 px-4 text-sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Enable Analytics
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 