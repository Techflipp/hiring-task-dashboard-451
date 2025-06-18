"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cameraApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Settings, Eye } from "lucide-react";
import Link from "next/link";

export default function DemographicsPage() {
  const [search, setSearch] = useState("");

  const { data: camerasData, isLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => cameraApi.getCameras({ page: 1, size: 100 }),
  });

  const cameras = camerasData?.items || [];
  const filteredCameras = cameras.filter((camera) =>
    camera.name.toLowerCase().includes(search.toLowerCase())
  );

  const camerasWithConfig = filteredCameras.filter(
    (camera) => camera.demographics_config
  );
  const camerasWithoutConfig = filteredCameras.filter(
    (camera) => !camera.demographics_config
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Demographics Configuration
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cameras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cameras with Configuration */}
        {camerasWithConfig.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Configured Cameras
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {camerasWithConfig.map((camera) => (
                <Card
                  key={camera.id}
                  className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="truncate">{camera.name}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/demographics/${
                            camera.demographics_config!.id
                          }/edit`}>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/cameras/${camera.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
                      {camera.demographics_config && (
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium">
                              Detection Confidence:
                            </span>{" "}
                            {camera.demographics_config
                              .detection_confidence_threshold
                              ? `${(
                                  camera.demographics_config
                                    .detection_confidence_threshold * 100
                                ).toFixed(1)}%`
                              : "Not set"}
                          </p>
                          <p>
                            <span className="font-medium">
                              Demographics Confidence:
                            </span>{" "}
                            {camera.demographics_config
                              .demographics_confidence_threshold
                              ? `${(
                                  camera.demographics_config
                                    .demographics_confidence_threshold * 100
                                ).toFixed(1)}%`
                              : "Not set"}
                          </p>
                          <p>
                            <span className="font-medium">Save Interval:</span>{" "}
                            {camera.demographics_config.save_interval
                              ? `${camera.demographics_config.save_interval}s`
                              : "Not set"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cameras without Configuration */}
        {camerasWithoutConfig.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Unconfigured Cameras
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {camerasWithoutConfig.map((camera) => (
                <Card
                  key={camera.id}
                  className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="truncate">{camera.name}</span>
                      <div className="flex gap-2">
                        <Link href={`/demographics/new?camera_id=${camera.id}`}>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/cameras/${camera.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
                      <p className="text-orange-600 font-medium">
                        No demographics configuration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredCameras.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No cameras found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
