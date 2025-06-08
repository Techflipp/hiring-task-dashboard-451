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
import { toast } from "sonner"
import { getCameraById, updateCamera } from "@/lib/cameras"
import { getAllTags } from "@/lib/tags"
import type { Camera } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const cameraFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rtsp_url: z.string().min(1, "RTSP URL is required"),
  stream_frame_width: z.coerce.number().int().min(1).max(2560).optional(),
  stream_frame_height: z.coerce.number().int().min(1).max(2560).optional(),
  stream_max_length: z.coerce.number().int().min(0).max(10000).optional(),
  stream_quality: z.coerce.number().int().min(80).max(100).optional(),
  stream_fps: z.coerce.number().int().min(1).max(120).optional(),
  stream_skip_frames: z.coerce.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
})

type CameraFormValues = z.infer<typeof cameraFormSchema>

interface CameraEditFormProps {
  cameraId: string
  initialData?: Camera
}

export default function CameraEditForm({ cameraId, initialData }: CameraEditFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: camera, isLoading: isLoadingCamera } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => getCameraById(cameraId),
    initialData,
    enabled: !initialData,
  })

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  })

  const updateCameraMutation = useMutation({
    mutationFn: (data: CameraFormValues) => updateCamera(cameraId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast.success("Camera updated", {
        description: "The camera has been updated successfully.",
      })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error) => {
      toast.error("Error", {
        description: "Failed to update camera. Please try again.",
      })
      console.error("Error updating camera:", error)
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    defaultValues: {
      name: camera?.name || "",
      rtsp_url: camera?.rtsp_url || "",
      stream_frame_width: camera?.stream_frame_width,
      stream_frame_height: camera?.stream_frame_height,
      stream_max_length: camera?.stream_max_length,
      stream_quality: camera?.stream_quality,
      stream_fps: camera?.stream_fps,
      stream_skip_frames: camera?.stream_skip_frames,
      tags: camera?.tags?.map((tag) => tag.id) || [],
    },
  })

  const onSubmit = (data: CameraFormValues) => {
    setIsSubmitting(true)
    updateCameraMutation.mutate(data)
  }

  if (isLoadingCamera && !initialData) {
    return <div className="text-center py-10">Loading camera data...</div>
  }

  const tagOptions =
    tagsData?.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) || []

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter camera name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rtsp_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTSP URL</FormLabel>
                    <FormControl>
                      <Input placeholder="rtsp://example.com/stream" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_frame_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Width</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1280" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 2560</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_frame_height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Height</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="720" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 2560</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_fps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FPS</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 1 and 120</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Quality</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="90" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 80 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_max_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Max Length</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 0 and 10000</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream_skip_frames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skip Frames</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Value between 0 and 100</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md">
                        {isLoadingTags ? (
                          <div className="col-span-full text-center py-4">Loading tags...</div>
                        ) : tagsData && tagsData.length > 0 ? (
                          tagsData.map((tag) => (
                            <div key={tag.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={tag.id}
                                checked={field.value?.includes(tag.id) || false}
                                onCheckedChange={(checked) => {
                                  const currentTags = field.value || []
                                  if (checked) {
                                    field.onChange([...currentTags, tag.id])
                                  } else {
                                    field.onChange(currentTags.filter((id) => id !== tag.id))
                                  }
                                }}
                              />
                              <Label htmlFor={tag.id} className="text-sm font-normal">
                                {tag.name}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-4 text-muted-foreground">No tags available</div>
                        )}
                      </div>
                    </FormControl>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
