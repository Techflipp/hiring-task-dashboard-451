"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Camera, UpdateCameraData } from "@/lib/types"
import { camerasApi, tagsApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

const updateCameraSchema = z.object({
  name: z.string().min(1, "Camera name is required"),
  rtsp_url: z.string().url("Please enter a valid RTSP URL"),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
})

interface CameraUpdateFormProps {
  camera: Camera
}

export function CameraUpdateForm({ camera }: CameraUpdateFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(camera.tags?.map((tag) => tag.id) || [])
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateCameraData>({
    resolver: zodResolver(updateCameraSchema),
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width,
      stream_frame_height: camera.stream_frame_height,
      stream_max_length: camera.stream_max_length,
      stream_quality: camera.stream_quality,
      stream_fps: camera.stream_fps,
      stream_skip_frames: camera.stream_skip_frames,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCameraData) => camerasApi.update(camera.id, data),
    onSuccess: (updatedCamera) => {
      queryClient.setQueryData(["camera", camera.id], updatedCamera)
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      toast({
        title: "Camera updated",
        description: "Camera settings have been successfully updated.",
      })
      reset({
        ...updatedCamera,
        tags: updatedCamera.tags?.map((tag) => tag.id),
      })
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update camera",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: UpdateCameraData) => {
    updateMutation.mutate({
      ...data,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    })
  }

  const handleTagChange = (tagId: string, checked: boolean) => {
    setSelectedTags((prev) => (checked ? [...prev, tagId] : prev.filter((id) => id !== tagId)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Camera Settings</CardTitle>
        <CardDescription>Modify camera configuration and stream parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Camera Name</Label>
                <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="rtsp_url">RTSP URL</Label>
                <Input
                  id="rtsp_url"
                  {...register("rtsp_url")}
                  className={errors.rtsp_url ? "border-destructive" : ""}
                />
                {errors.rtsp_url && <p className="text-sm text-destructive mt-1">{errors.rtsp_url.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stream_frame_width">Width</Label>
                  <Input
                    id="stream_frame_width"
                    type="number"
                    {...register("stream_frame_width", { valueAsNumber: true })}
                    className={errors.stream_frame_width ? "border-destructive" : ""}
                  />
                  {errors.stream_frame_width && (
                    <p className="text-sm text-destructive mt-1">{errors.stream_frame_width.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stream_frame_height">Height</Label>
                  <Input
                    id="stream_frame_height"
                    type="number"
                    {...register("stream_frame_height", { valueAsNumber: true })}
                    className={errors.stream_frame_height ? "border-destructive" : ""}
                  />
                  {errors.stream_frame_height && (
                    <p className="text-sm text-destructive mt-1">{errors.stream_frame_height.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stream_fps">FPS</Label>
                  <Input
                    id="stream_fps"
                    type="number"
                    {...register("stream_fps", { valueAsNumber: true })}
                    className={errors.stream_fps ? "border-destructive" : ""}
                  />
                  {errors.stream_fps && <p className="text-sm text-destructive mt-1">{errors.stream_fps.message}</p>}
                </div>
                <div>
                  <Label htmlFor="stream_quality">Quality (%)</Label>
                  <Input
                    id="stream_quality"
                    type="number"
                    {...register("stream_quality", { valueAsNumber: true })}
                    className={errors.stream_quality ? "border-destructive" : ""}
                  />
                  {errors.stream_quality && (
                    <p className="text-sm text-destructive mt-1">{errors.stream_quality.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stream_max_length">Max Length (s)</Label>
                  <Input
                    id="stream_max_length"
                    type="number"
                    {...register("stream_max_length", { valueAsNumber: true })}
                    className={errors.stream_max_length ? "border-destructive" : ""}
                  />
                  {errors.stream_max_length && (
                    <p className="text-sm text-destructive mt-1">{errors.stream_max_length.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stream_skip_frames">Skip Frames</Label>
                  <Input
                    id="stream_skip_frames"
                    type="number"
                    {...register("stream_skip_frames", { valueAsNumber: true })}
                    className={errors.stream_skip_frames ? "border-destructive" : ""}
                  />
                  {errors.stream_skip_frames && (
                    <p className="text-sm text-destructive mt-1">{errors.stream_skip_frames.message}</p>
                  )}
                </div>
              </div>

              {tags && tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={!isDirty || updateMutation.isPending}
            >
              Reset
            </Button>
            <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Update Camera
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
