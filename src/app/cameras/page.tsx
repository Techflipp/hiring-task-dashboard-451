"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Search, Plus, Camera, Tag, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"

interface CameraItem {
  id: string
  name: string
  rtsp_url: string
  tags: Array<{
    id: string
    name: string
    color: string
  }>
  is_active: boolean
  status_message: string
  snapshot: string
  created_at: string
  updated_at: string
}

interface CamerasResponse {
  items: CameraItem[]
  total: number
  page: number
  size: number
  pages: number
}

async function fetchCameras(page: number, size: number, search?: string): Promise<CamerasResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  })

  if (search) {
    params.append("camera_name", search)
  }

  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/cameras/?${params}`)
  if (!response.ok) {
    throw new Error("Failed to fetch cameras")
  }
  return response.json()
}

function CameraSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CameraCard({ camera }: { camera: CameraItem }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold truncate">{camera.name}</CardTitle>
          <div className="flex items-center gap-2">
            {camera.is_active ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <img
              src={camera.snapshot || "/placeholder.svg"}
              alt={`${camera.name} snapshot`}
              className="w-full h-32 object-cover rounded-lg bg-muted"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=128&width=256"
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground truncate">{camera.rtsp_url}</p>
            <p className="text-sm text-muted-foreground">{camera.status_message}</p>
          </div>

          {camera.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {camera.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
              {camera.tags.length > 3 && <Badge variant="outline">+{camera.tags.length - 3} more</Badge>}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(camera.updated_at).toLocaleDateString()}
            </div>
            <Link href={`/cameras/${camera.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CamerasPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, error } = useQuery({
    queryKey: ["cameras", page, pageSize, debouncedSearch],
    queryFn: () => fetchCameras(page, pageSize, debouncedSearch),
    keepPreviousData: true,
  })

  const totalPages = data?.pages || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Camera Management</h1>
            <p className="text-muted-foreground">Manage and monitor your camera network</p>
          </div>
          <Button asChild>
            <Link href="/cameras/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Camera
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cameras by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        {data && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {data.total} cameras
            </span>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>{data.items.filter((c) => c.is_active).length} active</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to load cameras. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => <CameraSkeleton key={i} />)
            : data?.items.map((camera) => <CameraCard key={camera.id} camera={camera} />)}
        </div>

        {/* Empty State */}
        {data && data.items.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cameras found</h3>
                <p className="text-muted-foreground mb-4">
                  {search ? "Try adjusting your search terms" : "Get started by adding your first camera"}
                </p>
                <Button asChild>
                  <Link href="/cameras/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Camera
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={page === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
