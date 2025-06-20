'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { CameraFormValues, cameraFormSchema } from '@/lib/validators/cameraSchema'
import { Alert, AlertDescription } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { Skeleton } from '../ui/Skeleton'
import { Label } from '../ui/Label'
import { useCameraDetail } from '@/hooks/useCameraDetails'
import { useUpdateCamera } from '@/hooks/useUpdateCamera'
import { CameraTag } from '@/types/camera.interface'

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
      tags: data.tags?.map((t: CameraTag) => t.id),
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
          {[
            { name: 'name', label: 'Name' },
            { name: 'rtsp_url', label: 'RTSP URL' },
            { name: 'stream_frame_width', label: 'Stream Width', type: 'number' },
            { name: 'stream_frame_height', label: 'Stream Height', type: 'number' },
            { name: 'stream_fps', label: 'Stream FPS', type: 'number' },
            { name: 'stream_quality', label: 'Stream Quality', type: 'number' },
            { name: 'stream_max_length', label: 'Stream Max Length', type: 'number' },
            { name: 'stream_skip_frames', label: 'Skip Frames', type: 'number' },
          ].map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Input
                type={field.type || 'text'}
                {...form.register(field.name as keyof CameraFormValues, {
                  valueAsNumber: field.type === 'number',
                })}
              />
              {form.formState.errors[field.name as keyof CameraFormValues] && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors[field.name as keyof CameraFormValues]?.message as string}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" disabled={updateMutation.isPending}>
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
