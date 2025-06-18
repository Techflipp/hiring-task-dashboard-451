'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Camera as CameraIcon, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { useCameras } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading cameras: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CameraIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Cameras</h1>
              <p className="text-gray-700 dark:text-gray-300">
                Manage your camera network and configurations
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
            <Input
              placeholder="Search cameras..."
              className="pl-10"
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Camera Grid */}
        {data && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((camera) => (
                <Card key={camera.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CameraIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{camera.name}</CardTitle>
                      </div>
                      <Badge variant={camera.is_active ? "active" : "inactive"} className="gap-1">
                        {camera.is_active ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {camera.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-700 dark:text-gray-300">
                      Created {formatDate(camera.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Camera Snapshot */}
                    {camera.snapshot ? (
                      <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={camera.snapshot}
                          alt={`${camera.name} snapshot`}
                          className="h-full w-full object-cover"
                          width={400}
                          height={128}
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Status Message */}
                    {camera.status_message && (
                      <p className="text-xs text-gray-700 dark:text-gray-300">{camera.status_message}</p>
                    )}

                    {/* RTSP URL */}
                    <div>
                      <p className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">RTSP URL</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-mono truncate bg-muted px-2 py-1 rounded cursor-help">
                            {camera.rtsp_url}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs break-all">{camera.rtsp_url}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Tags */}
                    {camera.tags && camera.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {camera.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                borderColor: tag.color,
                                color: tag.color 
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                        ID: {camera.id.slice(0, 8)}...
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/cameras/${camera.id}`}>
                          Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {((page - 1) * pageSize) + 1} to{' '}
                  {Math.min(page * pageSize, data.total)} of {data.total} cameras
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300 px-3">
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
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <CameraIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No cameras found</h3>
                <p className="text-gray-700 dark:text-gray-300">
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
    </TooltipProvider>
  );
} 