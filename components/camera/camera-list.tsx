'use client';

import { Camera, PaginatedResponse } from '../../lib/types';
import { CameraCard } from './camera-card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '../ui/pagination';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
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
            <Skeleton key={i} className="h-80 rounded-lg" />
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

  // Generate pagination items with ellipsis
  const generatePaginationItems = () => {
    const items = [];
    const totalPages = data.pages;
    const delta = 2; // Number of pages to show before/after current page

    // Helper function to add page item
    const addPageItem = (pageNum: number, isCurrent: boolean = false) => (
      <PaginationItem key={pageNum}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!isCurrent) onPageChange(pageNum);
          }}
          isActive={isCurrent}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );

    // Always show first page
    items.push(addPageItem(1, currentPage === 1));

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(addPageItem(i, currentPage === i));
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      items.push(addPageItem(totalPages, currentPage === totalPages));
    }

    return items;
  };

  return (
    <div>
      <div className="p-6">
        {/* Header with pagination info and page size selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.total)} of {data.total} cameras
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Camera grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.items.map((camera) => (
            <CameraCard key={camera.id} camera={camera} />
          ))}
        </div>

        {/* Pagination - only show if more than 1 page */}
        {data.pages > 1 && (
          <Pagination>
            <PaginationContent>
              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* Page numbers with ellipsis */}
              {generatePaginationItems()}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < data.pages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage === data.pages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}