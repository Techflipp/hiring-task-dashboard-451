"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Settings } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

const demographicsSchema = z.object({
  track_history_max_length: z.number().min(1).max(100).optional(),
  exit_threshold: z.number().min(1).max(300).optional(),
  min_track_duration: z.number().min(1).max(60).optional(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.number().min(1).max(100).optional(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional(),
  save_interval: z.number().min(300).max(1800).optional(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional(),
})

type DemographicsFormData = z.infer<typeof demographicsSchema>

interface Camera {
  id: string
  name: string
  demographics_config?: {
    id: string
    track_history_max_length: number
    exit_threshold: number
    min_track_duration: number
    detection_confidence_threshold: number
    demographics_confidence_threshold: number
    min_track_updates: number
    box_area_threshold: number
    save_interval: number
    frame_skip_interval: number
  }
}

async function fetchCamera(id: string): Promise<Camera> {
  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/cameras/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch camera")
  }
  return response.json()
}

async function createDemographicsConfig(cameraId: string, data: DemographicsFormData & { camera_id: string }) {
  const response = await fetch("https://task-451-api.ryd.wafaicloud.com/demographics/config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create demographics config")
  }
  return response.json()
}

async function updateDemographicsConfig(configId: string, data: DemographicsFormData) {
  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/demographics/config/${configId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update demographics config")
  }
  return response.json()
}

export default function DemographicsConfigPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const cameraId = params.id as string

  const { data: camera, isLoading } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => fetchCamera(cameraId),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DemographicsFormData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: camera?.demographics_config
      ? {
          track_history_max_length: camera.demographics_config.track_history_max_length,
          exit_threshold: camera.demographics_config.exit_threshold,
          min_track_duration: camera.demographics_config.min_track_duration,
          detection_confidence_threshold: camera.demographics_config.detection_confidence_threshold,
          demographics_confidence_threshold: camera.demographics_config.demographics_confidence_threshold,
          min_track_updates: camera.demographics_config.min_track_updates,
          box_area_threshold: camera.demographics_config.box_area_threshold,
          save_interval: camera.demographics_config.save_interval,
          frame_skip_interval: camera.demographics_config.frame_skip_interval,
        }
      : {
          track_history_max_length: 50,
          exit_threshold: 30,
          min_track_duration: 5,
          detection_confidence_threshold: 0.5,
          demographics_confidence_threshold: 0.7,
          min_track_updates: 10,
          box_area_threshold: 0.1,
          save_interval: 600,
          frame_skip_interval: 1.0,
        },
  })

  const saveMutation = useMutation({
    mutationFn: (data: DemographicsFormData) => {
      if (camera?.demographics_config) {
        return updateDemographicsConfig(camera.demographics_config.id, data)
      } else {
        return createDemographicsConfig(cameraId, { ...data, camera_id: cameraId })
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Demographics configuration saved successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save demographics configuration",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: DemographicsFormData) => {
    saveMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Camera not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/cameras/${cameraId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Camera
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demographics Configuration</h1>
            <p className="text-muted-foreground">Configure demographics tracking for {camera.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tracking Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tracking Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="track_history_max_length">Track History Max Length</Label>
                  <Input
                    id="track_history_max_length"
                    type="number"
                    min="1"
                    max="100"
                    {...register("track_history_max_length", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of tracking points (1-100)</p>
                  {errors.track_history_max_length && (
                    <p className="text-sm text-destructive">{errors.track_history_max_length.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit_threshold">Exit Threshold (seconds)</Label>
                  <Input
                    id="exit_threshold"
                    type="number"
                    min="1"
                    max="300"
                    {...register("exit_threshold", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Time before considering a person has left (1-300s)</p>
                  {errors.exit_threshold && <p className="text-sm text-destructive">{errors.exit_threshold.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_track_duration">Min Track Duration (seconds)</Label>
                  <Input
                    id="min_track_duration"
                    type="number"
                    min="1"
                    max="60"
                    {...register("min_track_duration", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Minimum tracking time to count (1-60s)</p>
                  {errors.min_track_duration && (
                    <p className="text-sm text-destructive">{errors.min_track_duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_track_updates">Min Track Updates</Label>
                  <Input
                    id="min_track_updates"
                    type="number"
                    min="1"
                    max="100"
                    {...register("min_track_updates", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Minimum updates before processing (1-100)</p>
                  {errors.min_track_updates && (
                    <p className="text-sm text-destructive">{errors.min_track_updates.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detection Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Detection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detection_confidence_threshold">Detection Confidence</Label>
                  <Input
                    id="detection_confidence_threshold"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    {...register("detection_confidence_threshold", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Confidence threshold for person detection (0.1-1.0)</p>
                  {errors.detection_confidence_threshold && (
                    <p className="text-sm text-destructive">{errors.detection_confidence_threshold.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demographics_confidence_threshold">Demographics Confidence</Label>
                  <Input
                    id="demographics_confidence_threshold"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1.0"
                    {...register("demographics_confidence_threshold", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Confidence threshold for demographics (0.1-1.0)</p>
                  {errors.demographics_confidence_threshold && (
                    <p className="text-sm text-destructive">{errors.demographics_confidence_threshold.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="box_area_threshold">Box Area Threshold</Label>
                  <Input
                    id="box_area_threshold"
                    type="number"
                    step="0.01"
                    min="0.05"
                    max="1.0"
                    {...register("box_area_threshold", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Minimum bounding box area ratio (0.05-1.0)</p>
                  {errors.box_area_threshold && (
                    <p className="text-sm text-destructive">{errors.box_area_threshold.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="save_interval">Save Interval (seconds)</Label>
                  <Input
                    id="save_interval"
                    type="number"
                    min="300"
                    max="1800"
                    {...register("save_interval", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">How often to save results (300-1800s)</p>
                  {errors.save_interval && <p className="text-sm text-destructive">{errors.save_interval.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frame_skip_interval">Frame Skip Interval</Label>
                  <Input
                    id="frame_skip_interval"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    {...register("frame_skip_interval", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">Seconds between processed frames (0.1-5.0s)</p>
                  {errors.frame_skip_interval && (
                    <p className="text-sm text-destructive">{errors.frame_skip_interval.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/cameras/${cameraId}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
