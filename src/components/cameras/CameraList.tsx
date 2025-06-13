import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCameras } from '@/lib/hooks/useCameras';
import { CameraCard } from './CameraCard';
import { CameraSearch } from './CameraSearch';
import { Pagination } from '../ui/Pagination';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';
import { Camera as CameraIcon } from 'lucide-react';

type SortField = 'name' | 'created_at' | 'updated_at';
type SortOrder = 'asc' | 'desc';

export const CameraList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pageParam = searchParams?.get('page');
  const perPageParam = searchParams?.get('per_page');
  const searchParam = searchParams?.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  const pageSize = perPageParam ? Math.max(12, parseInt(perPageParam, 10)) : 12;

  const { data, isLoading, error } = useCameras({
    page,
    size: pageSize,
    camera_name: searchTerm,
  });

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'updated_at', label: 'Updated Date' },
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const filteredAndSortedCameras = useMemo(() => {
    if (!data?.items) return [];

    let filtered = [...data.items];

    if (searchTerm) {
      filtered = filtered.filter(camera => 
        camera.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(camera => 
        statusFilter === 'active' ? camera.is_active : !camera.is_active
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      
      return sortOrder === 'asc'
        ? aDate - bDate
        : bDate - aDate;
    });

    return filtered;
  }, [data?.items, searchTerm, sortField, sortOrder, statusFilter]);

  const pageSizeOptions = [
    { value: '12', label: '12 per page' },
    { value: '24', label: '24 per page' },
    { value: '48', label: '48 per page' },
  ];

  const updateUrl = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/cameras?${newParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = e.target.value;
    updateUrl({ page: '1', per_page: newPageSize });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateUrl({ search: value, page: '1' });
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
            <CameraSearch onSearch={handleSearch} initialValue={searchParam} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              options={sortOptions}
            />
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              options={sortOrderOptions}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              options={statusOptions}
            />
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
          {filteredAndSortedCameras.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cameras found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedCameras.map((camera) => (
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