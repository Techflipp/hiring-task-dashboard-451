'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useCameraDetail, useUpdateCamera } from '@/hooks/useCamera'
import { CameraFormValues, cameraFormSchema } from '@/lib/validators/cameraSchema'
import { Alert, AlertDescription } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { Skeleton } from '../ui/Skeleton'
import { Label } from '../ui/Label'

export const CameraEditForm = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data, isLoading, error } = useCameraDetail(id)
  const updateMutation = useUpdateCamera(id)

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    defaultValues: {
      name: '',
      rtsp_url: '',
      tags: [],
    },
  })

  // Populate form once data is available
  if (data && !form.getValues('name')) {
    form.reset({
      name: data.name,
      rtsp_url: data.rtsp_url,
      stream_frame_width: data.stream_frame_width,
      stream_frame_height: data.stream_frame_height,
      stream_max_length: data.stream_max_length,
      stream_quality: data.stream_quality,
      stream_fps: data.stream_fps,
      stream_skip_frames: data.stream_skip_frames,
      tags: data.tags?.map((t: any) => t.id),
    })
  }

  const onSubmit = async (values: CameraFormValues) => {
    await updateMutation.mutateAsync(values)
    router.push(`/cameras/${id}`)
  }

  if (isLoading) return <Skeleton className="h-48 w-full" />
  if (error)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load camera.</AlertDescription>
      </Alert>
    )

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Edit Camera</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...form.register('name')} />
          </div>

          <div>
            <Label>RTSP URL</Label>
            <Input {...form.register('rtsp_url')} />
          </div>

          <div>
            <Label>Stream Width</Label>
            <Input type="number" {...form.register('stream_frame_width', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Stream Height</Label>
            <Input type="number" {...form.register('stream_frame_height', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Stream FPS</Label>
            <Input type="number" {...form.register('stream_fps', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Stream Quality</Label>
            <Input type="number" {...form.register('stream_quality', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Stream Max Length</Label>
            <Input type="number" {...form.register('stream_max_length', { valueAsNumber: true })} />
          </div>

          <div>
            <Label>Skip Frames</Label>
            <Input type="number" {...form.register('stream_skip_frames', { valueAsNumber: true })} />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
