import React, { useState } from 'react';
import { Camera } from '@/lib/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { TagList } from '../ui/TagList';
import { CameraUpdateForm } from './CameraUpdateForm';
import { DemographicsConfig } from '../demographics/DemographicsConfig';
import { DemographicsResults } from '../demographics/DemographicsResults';
import { 
  Camera as CameraIcon, 
  Settings, 
  BarChart3, 
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface CameraDetailProps {
  camera: Camera;
}

export const CameraDetail: React.FC<CameraDetailProps> = ({ camera }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'demographics' | 'analytics'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const tabs = [
    { id: 'details', label: 'Details', icon: CameraIcon },
    { id: 'demographics', label: 'Demographics Config', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{camera.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <StatusBadge 
                    status={camera.is_active ? 'active' : 'inactive'} 
                    size="md"
                    showIcon={true}
                  />
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Created: {formatDate(camera.created_at)}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Updated: {formatDate(camera.updated_at)}</span>
                  </div>
                </div>
              </div>
              {activeTab === 'details' && !isEditing && (
                <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">Edit Camera</Button>
              )}
            </div>
            
            {!camera.is_active && camera.status_message && (
              <div className="mt-4 flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Connection Issue</p>
                  <p className="text-sm text-red-700">{camera.status_message}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Camera Snapshot */}
          <div className="relative w-full lg:w-96 h-64 rounded-lg overflow-hidden shadow-md bg-gray-100">
            {!imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse">
                      <CameraIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>
                )}
                <Image
                  src={camera.snapshot}
                  alt={camera.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  priority
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  unoptimized
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Image unavailable</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'details' | 'demographics' | 'analytics')}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'details' && (
          <>
            {isEditing ? (
              <CameraUpdateForm
                camera={camera}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Camera Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">RTSP URL</h4>
                      <p className="mt-1 text-gray-900 break-all">{camera.rtsp_url}</p>
                    </div>
                    {camera.stream_frame_width && camera.stream_frame_height && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Resolution</h4>
                        <p className="mt-1 text-gray-900">
                          {camera.stream_frame_width} x {camera.stream_frame_height}
                        </p>
                      </div>
                    )}
                    {camera.stream_fps && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Frame Rate</h4>
                        <p className="mt-1 text-gray-900">{camera.stream_fps} FPS</p>
                      </div>
                    )}
                    {camera.stream_quality && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Stream Quality</h4>
                        <p className="mt-1 text-gray-900">{camera.stream_quality}%</p>
                      </div>
                    )}
                    {camera.stream_max_length && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Max Stream Length</h4>
                        <p className="mt-1 text-gray-900">{camera.stream_max_length} seconds</p>
                      </div>
                    )}
                    {camera.stream_skip_frames !== undefined && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Skip Frames</h4>
                        <p className="mt-1 text-gray-900">{camera.stream_skip_frames}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {camera.tags && camera.tags.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <TagList tags={camera.tags} maxVisible={100} size="md" showIcon={false} />
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'demographics' && (
          <DemographicsConfig
            camera={camera}
            config={camera.demographics_config}
          />
        )}

        {activeTab === 'analytics' && (
          <DemographicsResults cameraId={camera.id} />
        )}
      </div>
    </div>
  );
};