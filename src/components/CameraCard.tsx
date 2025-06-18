"use client";
import React from 'react';
import { FiCamera, FiEdit2, FiActivity } from 'react-icons/fi';
import Link from 'next/link';
import { Camera } from '@/lib/types';
import Image from 'next/image';
interface CameraCardProps {
  camera: Camera;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative">
        <Image
          src={camera.snapshot}
          alt={camera.name}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {camera.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            camera.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {camera.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{camera.name}</h3>
          <FiCamera
            className={`text-xl ${
              camera.is_active ? 'text-indigo-600' : 'text-gray-400'
            }`}
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">{camera.status_message}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Created: {new Date(camera.created_at).toLocaleDateString()}</span>
          <span>Updated: {new Date(camera.updated_at).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/cameras/${camera.id}`}
            className="flex-1 flex items-center justify-center py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-3xl"
          >
            <FiEdit2 className="mr-2" />
            Details
          </Link>
          <Link
            href={`/cameras/${camera.id}/analytics`}
            className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-800 rounded-3xl hover:bg-gray-200 transition-colors"
          >
            <FiActivity className="mr-2" />
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CameraCard;