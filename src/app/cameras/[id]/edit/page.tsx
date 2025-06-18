'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Camera as CameraIcon, Settings } from 'lucide-react';
import { useCamera, useUpdateCamera, useTags } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';

export default function EditCameraPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  
  const [formData, setFormData] = useState({
    name: '',
    rtsp_url: '',
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_max_length: 0,
    stream_quality: 85,
    stream_fps: 30,
    stream_skip_frames: 0,
    tags: [] as string[],
  });

  const { data: camera, isLoading: cameraLoading } = useCamera(cameraId);
  const { data: tagsData } = useTags();
  const updateMutation = useUpdateCamera();

  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name,
        rtsp_url: camera.rtsp_url,
        stream_frame_width: camera.stream_frame_width || 1920,
        stream_frame_height: camera.stream_frame_height || 1080,
        stream_max_length: camera.stream_max_length || 0,
        stream_quality: camera.stream_quality || 85,
        stream_fps: camera.stream_fps || 30,
        stream_skip_frames: camera.stream_skip_frames || 0,
        tags: camera.tags?.map(tag => tag.id) || [],
      });
    }
  }, [camera]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync({
        cameraId,
        data: formData,
      });
      
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      console.error('Failed to update camera:', error);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  if (cameraLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/cameras/${cameraId}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to camera</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Camera</h1>
                <p className="text-muted-foreground">
                  Update camera settings and configuration
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Camera name and RTSP connection details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Camera Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter camera name"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="rtsp_url" className="text-sm font-medium">
                    RTSP URL *
                  </label>
                  <Input
                    id="rtsp_url"
                    type="url"
                    value={formData.rtsp_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, rtsp_url: e.target.value }))}
                    placeholder="rtsp://camera-ip:port/stream"
                    className="font-mono"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The RTSP stream URL for this camera
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stream Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Configuration</CardTitle>
              <CardDescription>
                Video stream settings and quality parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="width" className="text-sm font-medium">
                    Frame Width
                  </label>
                  <Input
                    id="width"
                    type="number"
                    min="320"
                    max="3840"
                    value={formData.stream_frame_width}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_frame_width: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="height" className="text-sm font-medium">
                    Frame Height
                  </label>
                  <Input
                    id="height"
                    type="number"
                    min="240"
                    max="2160"
                    value={formData.stream_frame_height}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_frame_height: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="fps" className="text-sm font-medium">
                    Frame Rate (FPS)
                  </label>
                  <Input
                    id="fps"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.stream_fps}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_fps: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="quality" className="text-sm font-medium">
                    Quality (%)
                  </label>
                  <Input
                    id="quality"
                    type="number"
                    min="10"
                    max="100"
                    value={formData.stream_quality}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_quality: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="maxLength" className="text-sm font-medium">
                    Max Length (frames)
                  </label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="0"
                    value={formData.stream_max_length}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_max_length: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    0 = unlimited
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="skipFrames" className="text-sm font-medium">
                    Skip Frames
                  </label>
                  <Input
                    id="skipFrames"
                    type="number"
                    min="0"
                    value={formData.stream_skip_frames}
                    onChange={(e) => setFormData(prev => ({ ...prev, stream_skip_frames: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {tagsData && tagsData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Assign tags to categorize this camera
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tagsData.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={formData.tags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      style={formData.tags.includes(tag.id) ? {
                        backgroundColor: tag.color,
                        borderColor: tag.color,
                        color: 'white'
                      } : {
                        borderColor: tag.color,
                        color: tag.color
                      }}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Click tags to assign or remove them
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button variant="outline" asChild>
              <Link href={`/cameras/${cameraId}`}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {updateMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                Error updating camera: {updateMutation.error.message}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
} 