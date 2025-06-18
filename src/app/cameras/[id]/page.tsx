'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Plus, Camera as CameraIcon, CheckCircle, XCircle, Settings, Users, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useCamera, useDeleteDemographicsConfig } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/layout/navbar';
import { formatDate } from '@/lib/utils';

export default function CameraDetailPage() {
  const params = useParams();
  const cameraId = params.id as string;
  const [deletingConfigId, setDeletingConfigId] = useState<string | null>(null);

  const { data: camera, isLoading, error } = useCamera(cameraId);
  const deleteDemographicMutation = useDeleteDemographicsConfig();

  const handleDeleteDemographic = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this demographic configuration?')) {
      return;
    }

    setDeletingConfigId(configId);
    try {
      await deleteDemographicMutation.mutateAsync(configId);
    } catch (error) {
      console.error('Failed to delete demographic configuration:', error);
    } finally {
      setDeletingConfigId(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading camera: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="ml-auto">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Status Banner Skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Camera not found
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href="/cameras">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to cameras</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CameraIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{camera.name}</h1>
                <p className="text-gray-700 dark:text-gray-300">Camera Details and Configuration</p>
              </div>
            </div>
            <div className="ml-auto">
              <Button asChild>
                <Link href={`/cameras/${camera.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Camera
                </Link>
              </Button>
            </div>
          </div>

          {/* Status Banner */}
          <div className="flex items-center gap-2 mb-6">
                          <Badge variant={camera.is_active ? "active" : "inactive"} className="gap-2">
                {camera.is_active ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {camera.is_active ? 'Active' : 'Inactive'}
              </Badge>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Created {formatDate(camera.created_at)}
            </span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="demographics" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Demographics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Camera Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    Current camera snapshot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {camera.snapshot ? (
                    <div className="relative h-64 w-full bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={camera.snapshot}
                        alt={`${camera.name} snapshot`}
                        className="h-full w-full object-cover"
                        width={500}
                        height={256}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No snapshot available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Camera Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                  <CardDescription>
                    Camera settings and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Camera ID</label>
                    <p className="text-sm text-muted-foreground font-mono mt-1">{camera.id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">RTSP URL</label>
                    <p className="text-sm text-muted-foreground font-mono mt-1 bg-muted p-2 rounded break-all">
                      {camera.rtsp_url}
                    </p>
                  </div>

                  {camera.status_message && (
                    <div>
                      <label className="text-sm font-medium">Status Message</label>
                      <p className="text-sm text-muted-foreground mt-1">{camera.status_message}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(camera.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(camera.updated_at).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {camera.tags && camera.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>
                      Associated camera tags
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {camera.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          style={{ 
                            borderColor: tag.color,
                            color: tag.color 
                          }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Demographic Configurations</h3>
                <p className="text-sm text-muted-foreground">
                  Manage demographic analysis settings for this camera
                </p>
              </div>
              <Button asChild>
                <Link href={`/cameras/${camera.id}/demographics/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Configuration
                </Link>
              </Button>
            </div>

            {camera.demographics_config ? (
              <Card className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Demographics Configuration</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cameras/${camera.id}/demographics/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDemographic(camera.demographics_config!.id)}
                        disabled={deletingConfigId === camera.demographics_config!.id}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {deletingConfigId === camera.demographics_config!.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Detection Confidence</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {camera.demographics_config.detection_confidence_threshold || 'Default'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Demographics Confidence</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {camera.demographics_config.demographics_confidence_threshold || 'Default'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Track History Max</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {camera.demographics_config.track_history_max_length || 'Default'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Exit Threshold</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {camera.demographics_config.exit_threshold || 'Default'} seconds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
                    <span>Created {formatDate(camera.demographics_config.created_at)}</span>
                    <span className="font-mono">ID: {camera.demographics_config.id.slice(0, 8)}...</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No demographic configurations</h3>
                  <p className="text-muted-foreground mb-4">
                    No demographic analysis configurations have been set up for this camera yet.
                  </p>
                  <Button asChild>
                    <Link href={`/cameras/${camera.id}/demographics/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Configuration
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 