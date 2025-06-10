'use client';

import { Camera, PaginatedResponse } from '../../lib/types';
import { CameraCard } from './camera-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Select } from '../ui/select';
import { Skeleton } from '../ui/skeleton';

interface CameraListProps {
  data?: PaginatedResponse<Camera>;
  isLoading: boolean;
  error: Error | null;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  currentPage: number;
  pageSize: number;
}

export function CameraList({
  data,
  isLoading,
  error,
  onPageChange,
  onSizeChange,
  currentPage,
  pageSize,
}: CameraListProps) {
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading cameras: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No cameras found</p>
      </div>
    );
  }

  return (
    <div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.total)} of {data.total} cameras
        </p>
        <Select
        value={pageSize.toString()}
        onValueChange={(value) => onSizeChange(parseInt(value))}
        >
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.items.map((camera) => (
        <CameraCard key={camera.id} camera={camera} />
        ))}
      </div>

      <Pagination
        className="mt-4"
        aria-label="Pagination"
      >
        <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          />
        </PaginationItem>
        {Array.from({ length: data.pages }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
            href="#"
            isActive={currentPage === idx + 1}
            onClick={e => {
              e.preventDefault();
              if (currentPage !== idx + 1) onPageChange(idx + 1);
            }}
            >
            {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
            e.preventDefault();
            if (currentPage < data.pages) onPageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === data.pages}
            tabIndex={currentPage === data.pages ? -1 : 0}
          />
        </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    </div>
  );
}