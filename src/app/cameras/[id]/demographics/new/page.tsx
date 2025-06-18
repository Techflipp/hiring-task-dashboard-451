'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Settings, Camera as CameraIcon } from 'lucide-react';
import { useCamera, useCreateDemographicsConfig } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/layout/navbar';

export default function NewDemographicsPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  
  const [formData, setFormData] = useState({
    track_history_max_length: 50,
    exit_threshold: 30,
    min_track_duration: 5,
    detection_confidence_threshold: 0.5,
    demographics_confidence_threshold: 0.7,
    min_track_updates: 10,
    box_area_threshold: 0.1,
    save_interval: 600,
    frame_skip_interval: 1.0,
  });

  const { data: camera, isLoading: cameraLoading } = useCamera(cameraId);
  const createMutation = useCreateDemographicsConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMutation.mutateAsync({
        camera_id: cameraId,
        ...formData,
      });
      
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      console.error('Failed to create demographic configuration:', error);
    }
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
                  <Skeleton className="h-8 w-80" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>

            {/* Form Card Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  ))}
                  <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <h1 className="text-3xl font-bold tracking-tight">Create Demographics Configuration</h1>
                <p className="text-muted-foreground">
                  Set up demographic analysis for {camera.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-5 w-5" />
              Configuration Details
            </CardTitle>
            <CardDescription>
              Configure demographic analysis settings for this camera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                {/* Track History Max Length */}
                <div className="space-y-2">
                  <label htmlFor="trackHistory" className="text-sm font-medium">
                    Track History Max Length
                  </label>
                  <Input
                    id="trackHistory"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.track_history_max_length}
                    onChange={(e) => setFormData(prev => ({ ...prev, track_history_max_length: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of tracking history entries (1-100)
                  </p>
                </div>

                {/* Exit Threshold */}
                <div className="space-y-2">
                  <label htmlFor="exitThreshold" className="text-sm font-medium">
                    Exit Threshold (seconds)
                  </label>
                  <Input
                    id="exitThreshold"
                    type="number"
                    min="1"
                    max="300"
                    value={formData.exit_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, exit_threshold: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time threshold for considering a person as exited (1-300 seconds)
                  </p>
                </div>

                {/* Min Track Duration */}
                <div className="space-y-2">
                  <label htmlFor="minTrackDuration" className="text-sm font-medium">
                    Min Track Duration (seconds)
                  </label>
                  <Input
                    id="minTrackDuration"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.min_track_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_track_duration: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum duration for tracking (1-60 seconds)
                  </p>
                </div>

                {/* Detection Confidence */}
                <div className="space-y-2">
                  <label htmlFor="detectionConfidence" className="text-sm font-medium">
                    Detection Confidence Threshold
                  </label>
                  <Input
                    id="detectionConfidence"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={formData.detection_confidence_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, detection_confidence_threshold: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Confidence threshold for object detection (0.1-1.0)
                  </p>
                </div>

                {/* Demographics Confidence */}
                <div className="space-y-2">
                  <label htmlFor="demographicsConfidence" className="text-sm font-medium">
                    Demographics Confidence Threshold
                  </label>
                  <Input
                    id="demographicsConfidence"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    value={formData.demographics_confidence_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, demographics_confidence_threshold: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Confidence threshold for demographics analysis (0.1-1.0)
                  </p>
                </div>

                {/* Min Track Updates */}
                <div className="space-y-2">
                  <label htmlFor="minTrackUpdates" className="text-sm font-medium">
                    Min Track Updates
                  </label>
                  <Input
                    id="minTrackUpdates"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.min_track_updates}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_track_updates: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum number of track updates required (1-100)
                  </p>
                </div>

                {/* Box Area Threshold */}
                <div className="space-y-2">
                  <label htmlFor="boxAreaThreshold" className="text-sm font-medium">
                    Box Area Threshold
                  </label>
                  <Input
                    id="boxAreaThreshold"
                    type="number"
                    step="0.01"
                    min="0.05"
                    max="1.0"
                    value={formData.box_area_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, box_area_threshold: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum bounding box area threshold (0.05-1.0)
                  </p>
                </div>

                {/* Save Interval */}
                <div className="space-y-2">
                  <label htmlFor="saveInterval" className="text-sm font-medium">
                    Save Interval (seconds)
                  </label>
                  <Input
                    id="saveInterval"
                    type="number"
                    min="300"
                    max="1800"
                    value={formData.save_interval}
                    onChange={(e) => setFormData(prev => ({ ...prev, save_interval: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Interval for saving data (300-1800 seconds)
                  </p>
                </div>

                {/* Frame Skip Interval */}
                <div className="space-y-2">
                  <label htmlFor="frameSkipInterval" className="text-sm font-medium">
                    Frame Skip Interval
                  </label>
                  <Input
                    id="frameSkipInterval"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={formData.frame_skip_interval}
                    onChange={(e) => setFormData(prev => ({ ...prev, frame_skip_interval: Number(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Frame skip interval for processing (0.1-5.0)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <Button variant="outline" asChild>
                  <Link href={`/cameras/${cameraId}`}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  <Plus className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? 'Creating...' : 'Create Configuration'}
                </Button>
              </div>

              {createMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error creating configuration: {createMutation.error.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 