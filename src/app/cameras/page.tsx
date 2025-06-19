"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cameraApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";
// import { formatDate } from "@/lib/utils";

export default function CamerasPage() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cameras", page, size, search],
    queryFn: () =>
      cameraApi.getCameras({ page, size, camera_name: search || undefined }),
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Cameras
          </h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
          <Link href="/cameras/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search cameras..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Items per page:</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="border rounded-md px-3 py-2 text-sm">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data?.items.map((camera) => (
                <Card
                  key={camera.id}
                  className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="truncate">{camera.name}</span>
                      <div className="flex gap-2">
                        <Link href={`/cameras/${camera.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/cameras/${camera.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="truncate">
                        <span className="font-medium">RTSP URL:</span>{" "}
                        {camera.rtsp_url}
                      </p>
                      {camera.stream_frame_width &&
                        camera.stream_frame_height && (
                          <p>
                            <span className="font-medium">Resolution:</span>{" "}
                            {camera.stream_frame_width}x
                            {camera.stream_frame_height}
                          </p>
                        )}
                      {camera.stream_fps && (
                        <p>
                          <span className="font-medium">FPS:</span>{" "}
                          {camera.stream_fps}
                        </p>
                      )}
                      {camera.tags && camera.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {camera.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {data && data.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}>
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
