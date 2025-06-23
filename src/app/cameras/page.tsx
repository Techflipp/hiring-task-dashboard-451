'use client';

import { useState, useEffect } from 'react';
import { useCameras } from '@/hooks/use-cameras';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/custom-select';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Tag as TagIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function CamerasPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const { data, isLoading, refetch } = useCameras(page, pageSize, search);

  // Refetch data on initial load
  useEffect(() => {
    if (isInitialLoad) {
      refetch();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, refetch]);

  // Reset initial load state when navigating back
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsInitialLoad(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (data?.pages || 1)) return;
    setPage(newPage);
    // Scroll to top of the table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (data && page < data.pages) {
      handlePageChange(page + 1);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    if (data) {
      handlePageChange(data.pages);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'Home') {
        handleFirstPage();
      } else if (e.key === 'End') {
        handleLastPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, data?.pages]);

  const renderPaginationButtons = () => {
    if (!data) return null;

    const totalPages = data.pages;
    const currentPage = page;
    const maxVisiblePages = 5;
    const pages = [];

    // Calculate range of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button
          key="1"
          onClick={() => handlePageChange(1)}
          variant="outline"
          size="sm"
          className="min-w-[2rem]"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          className={`min-w-[2rem] ${
            i === currentPage 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </Button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant="outline"
          size="sm"
          className="min-w-[2rem]"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
        <p className="mt-2 text-base text-gray-600">
          Manage your cameras and view their configurations
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cameras by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
          />
        </div>
        <div className="flex items-center gap-4 ">
          <label className="text-base text-gray-700 font-medium">Show:</label>
          <CustomSelect
            value={pageSize}
            onChange={(value) => setPageSize(Number(value))}
            options={[
              { value: 10, label: '10 per page' },
              { value: 20, label: '20 per page' },
              { value: 50, label: '50 per page' },
            ]}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                  <div className="w-12 h-12 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                </div>
                <div className="text-base font-medium text-gray-700">Loading cameras...</div>
                
              </div>
            </div>
          ) : null}
          <div className="overflow-x-hidden">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-[#043872] ">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider w-1/5">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider w-1/5">
                    RTSP URL
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider w-48">
                    Tags
                  </th>
                  <th scope="col" className="px-6 text-nowrap py-4 text-left text-sm font-semibold text-white uppercase tracking-wider w-1/5">
                    Demographics Config
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.items.map((camera) => (
                  <tr key={camera.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-gray-900">{camera.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-[#1D1D1D] font-[500] truncate max-w-xs">{camera.rtsp_url}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 min-h-[32px] flex-nowrap whitespace-nowrap">
                          {camera.tags && camera.tags.length > 0 ? (
                            camera.tags.slice(0, expandedTags[camera.id] ? undefined : 2).map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap flex-shrink-0"
                              >
                                <TagIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                {tag.name.length > 15 ? `${tag.name.substring(0, 12)}...` : tag.name}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                              <TagIcon className="h-4 w-4 mr-1.5" />
                              No tags
                            </span>
                          )}
                        </div>
                        {camera.tags && camera.tags.length > 2 && (
                          <button
                            onClick={() => setExpandedTags(prev => ({
                              ...prev,
                              [camera.id]: !prev[camera.id]
                            }))}
                            className="text-sm text-[#043872] hover:text-[#032a54] font-medium transition-colors self-start"
                          >
                            {expandedTags[camera.id] ? 'Show Less' : `+${camera.tags.length - 2} More`}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        camera.demographics_config
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {camera.demographics_config ? 'Configured' : 'Not Configured'}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/cameras/${camera.id}`}>
                        <p className="text=[15px] font-[600] text-[#043872] font-[600]">
                          View Details
                        </p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {data && data.pages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Simple pagination controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1}
              variant="default"
              size="lg"
              className="min-w-[120px]"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <span className="text-base font-medium">
                Page {page} of {data.pages}
              </span>
            </div>
            <Button
              onClick={handleNextPage}
              disabled={page === data.pages}
              variant="default"
              size="lg"
              className="min-w-[120px] "
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Page info */}
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, data.total)} of {data.total} results
          </div>
        </div>
      )}
    </div>
  );
} 