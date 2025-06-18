'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Settings, Camera as CameraIcon } from 'lucide-react';
import { useCamera, useUpdateDemographicsConfig } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Navbar } from '@/components/layout/navbar';

export default function EditDemographicsPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;
  
  const [formData, setFormData] = useState({
    detection_confidence_threshold: 0.5,
    demographics_confidence_threshold: 0.5,
    track_history_max_length: 30,
    exit_threshold: 5,
  });

  const { data: camera } = useCamera(cameraId);
  const updateMutation = useUpdateDemographicsConfig();

  const config = camera?.demographics_config;

  useEffect(() => {
    if (config) {
      setFormData({
        detection_confidence_threshold: config.detection_confidence_threshold || 0.5,
        demographics_confidence_threshold: config.demographics_confidence_threshold || 0.5,
        track_history_max_length: config.track_history_max_length || 30,
        exit_threshold: config.exit_threshold || 5,
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config) return;
    
    try {
      await updateMutation.mutateAsync({
        configId: config.id,
        data: {
          detection_confidence_threshold: formData.detection_confidence_threshold,
          demographics_confidence_threshold: formData.demographics_confidence_threshold,
          track_history_max_length: formData.track_history_max_length,
          exit_threshold: formData.exit_threshold,
        }
      });
      
      router.push(`/cameras/${cameraId}`);
    } catch (error) {
      console.error('Failed to update demographic configuration:', error);
    }
  };

  if (!camera || !config) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert>
            <AlertDescription>
              Camera or configuration not found
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
                <h1 className="text-3xl font-bold tracking-tight">Edit Demographics Configuration</h1>
                <p className="text-muted-foreground">
                  Modify settings for {camera.name}
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
              Update the demographic analysis settings for this camera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Detection Confidence Threshold */}
                <div className="space-y-2">
                  <label htmlFor="detection_confidence" className="text-sm font-medium">
                    Detection Confidence Threshold
                  </label>
                  <Input
                    id="detection_confidence"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.detection_confidence_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, detection_confidence_threshold: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for person detection (0.0 to 1.0)
                  </p>
                </div>

                {/* Demographics Confidence Threshold */}
                <div className="space-y-2">
                  <label htmlFor="demographics_confidence" className="text-sm font-medium">
                    Demographics Confidence Threshold
                  </label>
                  <Input
                    id="demographics_confidence"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.demographics_confidence_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, demographics_confidence_threshold: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for demographic analysis (0.0 to 1.0)
                  </p>
                </div>

                {/* Track History Max Length */}
                <div className="space-y-2">
                  <label htmlFor="track_history" className="text-sm font-medium">
                    Track History Max Length
                  </label>
                  <Input
                    id="track_history"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.track_history_max_length}
                    onChange={(e) => setFormData(prev => ({ ...prev, track_history_max_length: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of frames to track each person
                  </p>
                </div>

                {/* Exit Threshold */}
                <div className="space-y-2">
                  <label htmlFor="exit_threshold" className="text-sm font-medium">
                    Exit Threshold (seconds)
                  </label>
                  <Input
                    id="exit_threshold"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.exit_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, exit_threshold: parseInt(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time in seconds before a person is considered to have exited
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
                <Button type="submit" disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {updateMutation.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error updating configuration: {updateMutation.error.message}
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