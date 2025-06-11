"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

const cameraSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rtsp_url: z.string().url("Must be a valid URL"),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
})

type CameraFormData = z.infer<typeof cameraSchema>

interface Camera {
  id: string
  name: string
  rtsp_url: string
  stream_frame_width?: number
  stream_frame_height?: number
  stream_max_length?: number
  stream_quality?: number
  stream_fps?: number
  stream_skip_frames?: number
  tags: Array<{
    id: string
    name: string
    color: string
  }>
}

interface Tag {
  id: string
  name: string
  color: string
}

async function fetchCamera(id: string): Promise<Camera> {
  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/cameras/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch camera")
  }
  return response.json()
}

async function fetchTags(): Promise<Tag[]> {
  const response = await fetch("https://task-451-api.ryd.wafaicloud.com/tags/")
  if (!response.ok) {
    throw new Error("Failed to fetch tags")
  }
  return response.json()
}

async function updateCamera(id: string, data: CameraFormData): Promise<Camera> {
  const response = await fetch(`https://task-451-api.ryd.wafaicloud.com/cameras/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update camera")
  }
  return response.json()
}

export default function EditCameraPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const cameraId = params.id as string

  const { data: camera, isLoading: cameraLoading } = useQuery({
    queryKey: ["camera", cameraId],
    queryFn: () => fetchCamera(cameraId),
  })

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: camera
      ? {
          name: camera.name,
          rtsp_url: camera.rtsp_url,
          stream_frame_width: camera.stream_frame_width,
          stream_frame_height: camera.stream_frame_height,
          stream_max_length: camera.stream_max_length,
          stream_quality: camera.stream_quality,
          stream_fps: camera.stream_fps,
          stream_skip_frames: camera.stream_skip_frames,
          tags: camera.tags.map((tag) => tag.id),
        }
      : undefined,
  })

  const selectedTags = watch("tags") || []

  const updateMutation = useMutation({
    mutationFn: (data: CameraFormData) => updateCamera(cameraId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Camera updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] })
      queryClient.invalidateQueries({ queryKey: ["cameras"] })
      router.push(`/cameras/${cameraId}`)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update camera",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: CameraFormData) => {
    updateMutation.mutate(data)
  }

  const handleTagToggle = (tagId: string) => {
    const currentTags = selectedTags
    const newTags = currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId]
    setValue("tags", newTags)
  }

  if (cameraLoading || tagsLoading) {
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Camera</h1>
            <p className="text-muted-foreground">Update camera settings and configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Camera Name *</Label>
                  <Input id="name" {...register("name")} placeholder="Enter camera name" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtsp_url">RTSP URL *</Label>
                  <Input id="rtsp_url" {...register("rtsp_url")} placeholder="rtsp://camera.local:554/stream" />
                  {errors.rtsp_url && <p className="text-sm text-destructive">{errors.rtsp_url.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stream Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream_frame_width">Frame Width</Label>
                  <Input
                    id="stream_frame_width"
                    type="number"
                    min="1"
                    max="2560"
                    {...register("stream_frame_width", { valueAsNumber: true })}
                    placeholder="1920"
                  />
                  {errors.stream_frame_width && (
                    <p className="text-sm text-destructive">{errors.stream_frame_width.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_frame_height">Frame Height</Label>
                  <Input
                    id="stream_frame_height"
                    type="number"
                    min="1"
                    max="2560"
                    {...register("stream_frame_height", { valueAsNumber: true })}
                    placeholder="1080"
                  />
                  {errors.stream_frame_height && (
                    <p className="text-sm text-destructive">{errors.stream_frame_height.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_max_length">Max Length</Label>
                  <Input
                    id="stream_max_length"
                    type="number"
                    min="0"
                    max="10000"
                    {...register("stream_max_length", { valueAsNumber: true })}
                    placeholder="3600"
                  />
                  {errors.stream_max_length && (
                    <p className="text-sm text-destructive">{errors.stream_max_length.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_quality">Quality (%)</Label>
                  <Input
                    id="stream_quality"
                    type="number"
                    min="80"
                    max="100"
                    {...register("stream_quality", { valueAsNumber: true })}
                    placeholder="90"
                  />
                  {errors.stream_quality && <p className="text-sm text-destructive">{errors.stream_quality.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_fps">FPS</Label>
                  <Input
                    id="stream_fps"
                    type="number"
                    min="1"
                    max="120"
                    {...register("stream_fps", { valueAsNumber: true })}
                    placeholder="30"
                  />
                  {errors.stream_fps && <p className="text-sm text-destructive">{errors.stream_fps.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream_skip_frames">Skip Frames</Label>
                  <Input
                    id="stream_skip_frames"
                    type="number"
                    min="0"
                    max="100"
                    {...register("stream_skip_frames", { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {errors.stream_skip_frames && (
                    <p className="text-sm text-destructive">{errors.stream_skip_frames.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {tags?.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label htmlFor={tag.id} className="flex items-center gap-2 cursor-pointer">
                        <Badge variant="secondary" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                          {tag.name}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags?.find((t) => t.id === tagId)
                        return tag ? (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            style={{ backgroundColor: tag.color + "20", color: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Camera
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
