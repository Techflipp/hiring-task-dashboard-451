"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Camera, CreateDemographicsConfigData, UpdateDemographicsConfigData } from "@/lib/types"
import { demographicsApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus } from "lucide-react"

const demographicsConfigSchema = z.object({
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

interface DemographicsConfigFormProps {
  camera: Camera
}

export function DemographicsConfigForm({ camera }: DemographicsConfigFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isUpdate = !!camera.demographics_config

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateDemographicsConfigData>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: camera.demographics_config
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
      : {},
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateDemographicsConfigData) => demographicsApi.createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", camera.id] })
      toast({
        title: "Demographics configuration created",
        description: "Analytics tracking has been enabled for this camera.",
      })
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create demographics configuration",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateDemographicsConfigData) =>
      demographicsApi.updateConfig(camera.demographics_config!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", camera.id] })
      toast({
        title: "Demographics configuration updated",
        description: "Analytics settings have been successfully updated.",
      })
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update demographics configuration",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: UpdateDemographicsConfigData) => {
    if (isUpdate) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate({
        camera_id: camera.id,
        ...data,
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isUpdate ? "Update Demographics Configuration" : "Create Demographics Configuration"}</CardTitle>
        <CardDescription>
          {isUpdate
            ? "Modify analytics tracking parameters for this camera"
            : "Enable demographic analytics tracking for this camera"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="track_history_max_length">Track History Max Length</Label>
              <Input
                id="track_history_max_length"
                type="number"
                step="1"
                min="1"
                max="100"
                {...register("track_history_max_length", { valueAsNumber: true })}
                className={errors.track_history_max_length ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 1-100</p>
              {errors.track_history_max_length && (
                <p className="text-sm text-destructive mt-1">{errors.track_history_max_length.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="exit_threshold">Exit Threshold</Label>
              <Input
                id="exit_threshold"
                type="number"
                step="1"
                min="1"
                max="300"
                {...register("exit_threshold", { valueAsNumber: true })}
                className={errors.exit_threshold ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 1-300</p>
              {errors.exit_threshold && (
                <p className="text-sm text-destructive mt-1">{errors.exit_threshold.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="min_track_duration">Min Track Duration</Label>
              <Input
                id="min_track_duration"
                type="number"
                step="1"
                min="1"
                max="60"
                {...register("min_track_duration", { valueAsNumber: true })}
                className={errors.min_track_duration ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 1-60 seconds</p>
              {errors.min_track_duration && (
                <p className="text-sm text-destructive mt-1">{errors.min_track_duration.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="detection_confidence_threshold">Detection Confidence</Label>
              <Input
                id="detection_confidence_threshold"
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                {...register("detection_confidence_threshold", { valueAsNumber: true })}
                className={errors.detection_confidence_threshold ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 0.1-1.0</p>
              {errors.detection_confidence_threshold && (
                <p className="text-sm text-destructive mt-1">{errors.detection_confidence_threshold.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="demographics_confidence_threshold">Demographics Confidence</Label>
              <Input
                id="demographics_confidence_threshold"
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                {...register("demographics_confidence_threshold", { valueAsNumber: true })}
                className={errors.demographics_confidence_threshold ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 0.1-1.0</p>
              {errors.demographics_confidence_threshold && (
                <p className="text-sm text-destructive mt-1">{errors.demographics_confidence_threshold.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="min_track_updates">Min Track Updates</Label>
              <Input
                id="min_track_updates"
                type="number"
                step="1"
                min="1"
                max="100"
                {...register("min_track_updates", { valueAsNumber: true })}
                className={errors.min_track_updates ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 1-100</p>
              {errors.min_track_updates && (
                <p className="text-sm text-destructive mt-1">{errors.min_track_updates.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="box_area_threshold">Box Area Threshold</Label>
              <Input
                id="box_area_threshold"
                type="number"
                step="0.01"
                min="0.05"
                max="1.0"
                {...register("box_area_threshold", { valueAsNumber: true })}
                className={errors.box_area_threshold ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 0.05-1.0</p>
              {errors.box_area_threshold && (
                <p className="text-sm text-destructive mt-1">{errors.box_area_threshold.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="save_interval">Save Interval</Label>
              <Input
                id="save_interval"
                type="number"
                step="1"
                min="300"
                max="1800"
                {...register("save_interval", { valueAsNumber: true })}
                className={errors.save_interval ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 300-1800 seconds</p>
              {errors.save_interval && <p className="text-sm text-destructive mt-1">{errors.save_interval.message}</p>}
            </div>

            <div>
              <Label htmlFor="frame_skip_interval">Frame Skip Interval</Label>
              <Input
                id="frame_skip_interval"
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                {...register("frame_skip_interval", { valueAsNumber: true })}
                className={errors.frame_skip_interval ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground mt-1">Range: 0.1-5.0</p>
              {errors.frame_skip_interval && (
                <p className="text-sm text-destructive mt-1">{errors.frame_skip_interval.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty || isPending}>
              Reset
            </Button>
            <Button type="submit" disabled={(!isDirty && isUpdate) || isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isUpdate ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isUpdate ? "Update Configuration" : "Create Configuration"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
