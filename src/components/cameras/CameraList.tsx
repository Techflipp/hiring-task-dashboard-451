import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCameras } from '@/lib/hooks/useCameras';
import { CameraCard } from './CameraCard';
import { CameraSearch } from './CameraSearch';
import { Pagination } from '../ui/Pagination';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';
import { Camera as CameraIcon } from 'lucide-react';

export const CameraList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const pageParam = searchParams?.get('page');
  const perPageParam = searchParams?.get('per_page');
  
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const pageSize = perPageParam ? Math.max(12, parseInt(perPageParam, 10)) : 12;

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

  const updateUrl = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    params.set('per_page', newPageSize.toString());
    router.push(`/cameras?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(newPage, pageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    updateUrl(1, newPageSize);
  };

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
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full">
          <div className="w-full sm:w-64">
            <CameraSearch onSearch={setSearchTerm} />
          </div>
          <div className="w-full sm:w-40">
            <Select
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              options={pageSizeOptions}
            />
          </div>
        </div>
      </div>

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
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};