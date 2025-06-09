"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { getCameraById } from "@/lib/cameras"
import { createDemographicsConfig, updateDemographicsConfig } from "@/lib/demographics"
import { toast } from "sonner"

const configFormSchema = z.object({
  track_history_max_length: z.coerce.number().int().min(1).max(100).optional(),
  exit_threshold: z.coerce.number().int().min(1).max(300).optional(),
  min_track_duration: z.coerce.number().int().min(1).max(60).optional(),
  detection_confidence_threshold: z.coerce.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.coerce.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.coerce.number().int().min(1).max(100).optional(),
  box_area_threshold: z.coerce.number().min(0.05).max(1.0).optional(),
  save_interval: z.coerce.number().int().min(300).max(1800).optional(),
  frame_skip_interval: z.coerce.number().min(0.1).max(5.0).optional(),
})

type ConfigFormValues = z.infer<typeof configFormSchema>

interface DemographicsConfigFormProps {
  cameraId: string
}

export default function DemographicsConfigForm({ cameraId }: DemographicsConfigFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: camera, isLoading } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => getCameraById(cameraId),
  })

  const configExists = !!camera?.demographics_config

  const createConfigMutation = useMutation({
    mutationFn: (data: ConfigFormValues) =>
      createDemographicsConfig({
        camera_id: cameraId,
        ...data,
      }),
    onSuccess: () => {
      handleSuccess()
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const updateConfigMutation = useMutation({
    mutationFn: (data: ConfigFormValues) => {
      if (!camera?.demographics_config?.id) {
        throw new Error("Config ID not found")
      }
      return updateDemographicsConfig(camera.demographics_config.id, data)
    },
    onSuccess: () => {
      handleSuccess()
    },
    onError: (error) => {
      handleError(error)
    },
  })

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
    toast.success(`Configuration ${configExists ? "updated" : "created"}`, {
      description: `Demographics configuration has been ${configExists ? "updated" : "created"} successfully.`,
    })
    router.push(`/cameras/${cameraId}`)
    setIsSubmitting(false)
  }

  const handleError = (error: unknown) => {
    toast.error("Error", {
      description: `Failed to ${configExists ? "update" : "create"} configuration. Please try again.`,
    })
    console.error(`Error ${configExists ? "updating" : "creating"} configuration:`, error)
    setIsSubmitting(false)
  }

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      track_history_max_length: camera?.demographics_config?.track_history_max_length || 50,
      exit_threshold: camera?.demographics_config?.exit_threshold || 150,
      min_track_duration: camera?.demographics_config?.min_track_duration || 30,
      detection_confidence_threshold: camera?.demographics_config?.detection_confidence_threshold || 0.5,
      demographics_confidence_threshold: camera?.demographics_config?.demographics_confidence_threshold || 0.5,
      min_track_updates: camera?.demographics_config?.min_track_updates || 50,
      box_area_threshold: camera?.demographics_config?.box_area_threshold || 0.5,
      save_interval: camera?.demographics_config?.save_interval || 600,
      frame_skip_interval: camera?.demographics_config?.frame_skip_interval || 1.0,
    },
  })

  const onSubmit = (data: ConfigFormValues) => {
    setIsSubmitting(true)
    if (configExists) {
      updateConfigMutation.mutate(data)
    } else {
      createConfigMutation.mutate(data)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading camera data...</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="track_history_max_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Track History Max Length</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exit_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 300</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_track_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Track Duration</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 60</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detection_confidence_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detection Confidence Threshold: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={1.0}
                        step={0.01}
                        defaultValue={[field.value || 0.5]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>Value between 0.1 and 1.0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demographics_confidence_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demographics Confidence Threshold: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={1.0}
                        step={0.01}
                        defaultValue={[field.value || 0.5]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>Value between 0.1 and 1.0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_track_updates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Track Updates</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="box_area_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Area Threshold: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0.05}
                        max={1.0}
                        step={0.01}
                        defaultValue={[field.value || 0.5]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>Value between 0.05 and 1.0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="save_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Save Interval (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 300 and 1800</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frame_skip_interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Skip Interval: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={5.0}
                        step={0.1}
                        defaultValue={[field.value || 1.0]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>Value between 0.1 and 5.0</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push(`/cameras/${cameraId}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {configExists ? "Update" : "Create"} Configuration
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
