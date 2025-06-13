'use client'

import type React from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

import { createQueryString } from '@/lib/utils'
import { useCameras } from '@/hooks/use-cameras'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CameraListSkeleton } from './camera-list-skeleton'
import { CameraCard } from './camera-card'
import { EmptyState } from '../ui/empty-list'

type CameraListProps = {
  page: number
  size: number
  cameraName?: string
}

export const CameraList = ({ page, size, cameraName }: CameraListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState(cameraName || '')

  const { data, isLoading, isError } = useCameras(page, size, cameraName)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(
      `${pathname}?${createQueryString({
        params: {
          camera_name: searchQuery || null,
          page: 1, // Reset to first page on new search
        },
      })}`
    )
  }

  const handleSizeChange = (newSize: string) => {
    router.push(
      `${pathname}?${createQueryString({
        params: {
          size: newSize,
          page: 1,
        },
      })}`
    )
  }

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({
        params: {
          page: newPage,
        },
      })}`
    )
  }

  if (isLoading) {
    return <CameraListSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="py-12">
        <EmptyState
          title="Error loading cameras"
          description="There was an error loading the cameras. Please try again later."
          icon="camera"
        />
      </div>
    )
  }

  if (data.items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="No cameras found"
          description={
            cameraName
              ? `No cameras found matching "${cameraName}". Try a different search term.`
              : 'No cameras have been added yet.'
          }
          icon="camera"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <form
          onSubmit={handleSearch}
          className="flex w-full gap-2 sm:max-w-sm"
        >
          <Input
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">Show:</span>
          <Select
            value={size.toString()}
            onValueChange={handleSizeChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="20 items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 items</SelectItem>
              <SelectItem value="20">20 items</SelectItem>
              <SelectItem value="50">50 items</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {(page - 1) * size + 1}-{Math.min(page * size, data.total)} of {data.total} cameras
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= data.pages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
