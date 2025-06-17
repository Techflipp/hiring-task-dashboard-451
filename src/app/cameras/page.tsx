'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Camera as CameraIcon, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { useCameras } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { debounce } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export default function CamerasPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearch(value);
      setPage(1); // Reset to first page when searching
    }, 300),
    []
  );

  const { data, isLoading, error } = useCameras({
    page,
    size: pageSize,
    camera_name: search || undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error loading cameras</h1>
            <p className="mt-2 text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
            <p className="mt-2 text-gray-600">
              Manage your camera network and configurations
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search cameras..."
              className="pl-10"
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Camera Grid */}
        {data && (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((camera) => (
                <Card key={camera.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CameraIcon className="h-5 w-5 text-blue-600" />
                        {camera.name}
                      </div>
                      <div className="flex items-center gap-2">
                        {camera.is_active ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Created {formatDate(camera.created_at)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Camera Snapshot */}
                      {camera.snapshot ? (
                        <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={camera.snapshot}
                            alt={`${camera.name} snapshot`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2 w-2 rounded-full ${
                            camera.is_active ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className={`text-sm ${
                            camera.is_active ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {camera.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {camera.status_message && (
                          <p className="text-xs text-gray-500 mt-1">{camera.status_message}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">RTSP URL</p>
                        <p className="text-sm text-gray-600 truncate">{camera.rtsp_url}</p>
                      </div>

                      {camera.tags && camera.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tags</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {camera.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: tag.color + '20',
                                  color: tag.color 
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            Camera ID: {camera.id.slice(0, 8)}...
                          </span>
                        </div>
                        <Link 
                          href={`/cameras/${camera.id}`}
                          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500 h-8 px-3 text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((page - 1) * pageSize) + 1} to{' '}
                  {Math.min(page * pageSize, data.total)} of {data.total} cameras
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {data.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                    disabled={page === data.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {data.items.length === 0 && (
              <div className="mt-8 text-center py-12">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No cameras found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search 
                    ? 'Try adjusting your search terms.' 
                    : 'No cameras are currently available in the system.'
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 