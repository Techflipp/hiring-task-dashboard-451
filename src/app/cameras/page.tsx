"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCameras } from "@/hooks/use-cameras";
import { CameraCard } from "@/components/cameras/camera-card";
import { CameraListSkeleton } from "@/components/cameras/camera-list-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Video } from "lucide-react";

export default function CamerasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("camera_name") || ""
  );

  const [pageSize, setPageSize] = useState(() => {
    const sizeParam = searchParams.get("size");
    return sizeParam ? Number(sizeParam) : 6;
  });

  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const sizeParam = searchParams.get("size");
    if (sizeParam) {
      setPageSize(Number(sizeParam));
    }
  }, [searchParams]);

  const { data, isLoading, error } = useCameras({
    page: currentPage,
    size: pageSize,
    camera_name: searchParams.get("camera_name") || undefined,
  });

  const updateSearchParams = (
    params: Record<string, string | number | undefined>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        newSearchParams.set(key, String(value));
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/cameras?${newSearchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ camera_name: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    updateSearchParams({ size: newSize, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Camera Management
        </h1>
        <p className="text-gray-600">Manage and monitor your camera network</p>
      </div>

      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search cameras by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <label htmlFor="page-size" className="text-sm text-gray-600">
            Items per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Failed to load cameras"
          message={
            error.message ||
            "We couldn't load the camera list. Please check your connection and try again."
          }
          onRetry={() => window.location.reload()}
        />
      )}

      {!error && (
        <>
          {isLoading ? (
            <CameraListSkeleton />
          ) : data?.items.length === 0 ? (
            <EmptyState
              icon={Video}
              title="No cameras found"
              description={
                searchParams.get("camera_name")
                  ? "No cameras match your search criteria. Try adjusting your filters."
                  : "Get started by adding your first camera to the system."
              }
            />
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {data?.items.map((camera) => (
                  <CameraCard key={camera.id} camera={camera} />
                ))}
              </div>

              {data && data.pages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {data && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, data.total)} of {data.total} cameras
        </div>
      )}
    </div>
  );
}
