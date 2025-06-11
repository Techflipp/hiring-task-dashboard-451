'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import { CameraList } from '../../../components/camera/camera-list';
import { CameraSearch } from '../../../components/camera/camera-search';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { CameraFilters } from '../../../lib/types';

export default function CamerasPage() {
  const [filters, setFilters] = useState<CameraFilters>({
    page: 1,
    size: 20,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['cameras', filters],
    queryFn: () => apiClient.getCameras(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearchChange = (camera_name: string) => {
    setFilters(prev => ({ ...prev, camera_name, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSizeChange = (size: number) => {
    setFilters(prev => ({ ...prev, size, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
          <p className="text-gray-600 mt-2">
            Manage your camera network and configurations
          </p>
        </div>
        
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <CameraSearch 
            onSearchChange={handleSearchChange}
            initialValue={filters.camera_name || ''}
          />
        </div>

        <CameraList
          data={data}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onSizeChange={handleSizeChange}
          currentPage={filters.page || 1}
          pageSize={filters.size || 20}
        />
      </div>
    </div>
  );
}