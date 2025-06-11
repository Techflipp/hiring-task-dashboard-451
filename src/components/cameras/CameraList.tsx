import React, { useState } from 'react';
import { useCameras } from '@/lib/hooks/useCameras';
import { CameraCard } from './CameraCard';
import { CameraSearch } from './CameraSearch';
import { Pagination } from '../ui/Pagination';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';
import { Camera as CameraIcon } from 'lucide-react';

export const CameraList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useCameras({
    page,
    size: pageSize,
    camera_name: searchTerm,
  });

  const pageSizeOptions = [
    { value: '12', label: '12 per page' },
    { value: '24', label: '24 per page' },
    { value: '48', label: '48 per page' },
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading cameras. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
        <CameraIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Cameras</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <CameraSearch onSearch={setSearchTerm} />
          <Select
            value={pageSize.toString()}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            options={pageSizeOptions}
            className="w-full sm:w-40"
          />
        </div>
      </div>

      {/* Stats Bar */}
      {data && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.total}</p>
              <p className="text-sm text-gray-500">Total Cameras</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {data.items.filter(cam => cam.is_active).length}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {data.items.filter(cam => !cam.is_active).length}
              </p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.items.filter(cam => cam.demographics_config).length}
              </p>
              <p className="text-sm text-gray-500">With Demographics</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} height={320} className="rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {data && data.items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cameras found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.items.map((camera) => (
                <CameraCard key={camera.id} camera={camera} />
              ))}
            </div>
          )}

          {data && data.pages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};