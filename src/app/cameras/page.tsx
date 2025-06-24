"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { camerasApi } from "@/lib/api"
import { CameraCard } from "@/components/camera-card"
import { CameraListSkeleton } from "@/components/camera-list-skeleton"
import { SearchInput } from "@/components/search-input"
import { PaginationControls } from "@/components/pagination-controls"
import { PageSizeSelector } from "@/components/page-size-selector"
import { ErrorMessage } from "@/components/error-message"
import { debounce } from "@/lib/utils"

export default function CamerasPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cameras", page, pageSize, searchQuery],
    queryFn: () =>
      camerasApi.getList({
        page,
        size: pageSize,
        camera_name: searchQuery || undefined,
      }),
  })

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
    setPage(1) // Reset to first page when searching
  }, 300)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1) // Reset to first page when changing page size
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load cameras"
        message="There was an error loading the camera list. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cameras</h1>
          <p className="text-muted-foreground">Manage your camera network and configurations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <SearchInput placeholder="Search cameras..." onSearch={debouncedSearch} className="w-full sm:w-80" />
          <PageSizeSelector value={pageSize} onChange={handlePageSizeChange} options={[10, 20, 50, 100]} />
        </div>
      </div>

      {isLoading ? (
        <CameraListSkeleton count={pageSize} />
      ) : (
        <>
          {data?.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery ? "No cameras found matching your search." : "No cameras available."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map((camera) => (
                  <CameraCard key={camera.id} camera={camera} />
                ))}
              </div>

              {data && data.pages > 1 && (
                <PaginationControls
                  currentPage={page}
                  totalPages={data.pages}
                  onPageChange={handlePageChange}
                  totalItems={data.total}
                  itemsPerPage={pageSize}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
