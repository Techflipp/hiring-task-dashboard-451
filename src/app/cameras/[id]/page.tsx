"use client";
import React from 'react';
import { FiChevronLeft, FiEdit, FiSettings, FiActivity, FiPlus } from 'react-icons/fi';
import CameraStream from '@/components/CameraStream';
import DemographicsConfig from '@/components/DemographicsConfig';
import Link from 'next/link';
import CameraDetailPageHooks from '@/hooks/CameraDetailPageHooks';

export default function CameraDetailPage() {
 
  const {
    camera,
    config,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleCreateConfig,
    id
  } = CameraDetailPageHooks();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse bg-gray-200 h-8 w-32 mb-6 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (error || !camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error || 'Camera not found'}</p>
          <Link
            href={'/cameras'}
            className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Cameras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
     <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
  <div className="flex items-center">
    <Link
      href={'/cameras'}
      className="mr-2 p-2 rounded-full hover:bg-gray-100"
    >
      <FiChevronLeft size={24} />
    </Link>
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
      {camera.name}
    </h1>
  </div>

  <div className="sm:ml-auto flex flex-wrap gap-2">
    {['details', 'config', 'analytics'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex items-center px-4 py-2 rounded-3xl ${
          activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-100'
        }`}
      >
        {tab === 'details' && <FiEdit className="mr-2" />}
        {tab === 'config' && <FiSettings className="mr-2" />}
        {tab === 'analytics' && <FiActivity className="mr-2" />}
        {tab}
      </button>
    ))}
  </div>
</div>


      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CameraStream rtspUrl={camera.rtsp_url} snapshotUrl={camera.snapshot} />
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Camera Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">RTSP URL</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{camera.rtsp_url}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    camera.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {camera.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {camera.stream_frame_width && camera.stream_frame_height && (
                  <div>
                    <p className="text-sm text-gray-500">Resolution</p>
                    <p>{camera.stream_frame_width} × {camera.stream_frame_height}</p>
                  </div>
                )}
                {camera.stream_fps && (
                  <div>
                    <p className="text-sm text-gray-500">FPS</p>
                    <p>{camera.stream_fps}</p>
                  </div>
                )}
                {camera.stream_quality && (
                  <div>
                    <p className="text-sm text-gray-500">Quality</p>
                    <p>{camera.stream_quality}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {camera.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: tag.color, color: 'white' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-4">Timestamps</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p>{new Date(camera.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p>{new Date(camera.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {config ? (
            <DemographicsConfig cameraId={camera.id} initialConfig={config} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No Configuration Found</h3>
              <p className="text-gray-600 mb-6">
                This camera doesn't have a demographics configuration yet.
              </p>
              <button
                onClick={handleCreateConfig}
                className="flex items-center justify-center mx-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create Configuration
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <Link href={`/cameras/${id}/analytics`} className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-medium">
            <FiActivity className="mr-2" />
            View detailed analytics dashboard
          </Link>
        </div>
      )}
    </div>
  );
}