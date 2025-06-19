"use client"

import  Link  from 'next/link';
import React, { useState } from 'react';
import { Camera, Wifi, WifiOff, Play, Eye, Settings, MoreHorizontal } from 'lucide-react';
import CameraMenu from './CameraMenu';

const CameraCard = ({ camera, viewMode }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (isActive, statusMessage) => {
    if (!isActive) return 'text-red-500 bg-red-50 border-red-200';
    if (statusMessage.toLowerCase().includes('recording')) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusIcon = (isActive, statusMessage) => {
    if (!isActive) return <WifiOff className="w-3 h-3" />;
    if (statusMessage.toLowerCase().includes('recording')) return <Play className="w-3 h-3" />;
    return <Wifi className="w-3 h-3" />;
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {!imageError ? (
                <img
                  src={camera.snapshot}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                camera.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {camera.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  camera.is_active,
                  camera.status_message
                )}`}
              >
                {getStatusIcon(camera.is_active, camera.status_message)}
                {camera.status_message}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {camera.tags?.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/cameras/${camera?.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
              <CameraMenu cameraId={camera.id} />
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-gray-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!imageError ? (
          <img
            src={camera.snapshot}
            alt={camera.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}

        <div className={`absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-white ${camera.is_active ? 'bg-green-500' : 'bg-red-500'}`} />

        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2">
            <Link href={`/cameras/${camera?.id}`} className="p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110">
              <Eye className="w-5 h-5 text-gray-700" />
            </Link>
            <Link
            href={`/cameras/${camera?.id}/edit`}
             className="p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200 hover:scale-110">
              <Settings className="w-5 h-5 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{camera.name}</h3>
           <CameraMenu cameraId={camera.id} />
          
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(camera.is_active, camera.status_message)}`}>
            {getStatusIcon(camera.is_active, camera.status_message)}
            {camera.status_message}
          </span>
        </div>

        {camera.tags && camera.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {camera.tags.map(tag => (
              <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCard;