'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Camera, Tag } from '@/lib/types'
import { useUpdateCamera } from '@/hooks/use-cameras'
import { cameraFormSchema, type CameraFormValues } from '@/schemas/cameraForm.schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'

export const CameraForm = ({ camera, tags }: { camera: Camera; tags: Tag[] }) => {
  const router = useRouter()
  const { mutate: updateCamera, isPending } = useUpdateCamera()
  const [selectedTags, setSelectedTags] = useState<Tag[]>(camera.tags || [])

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(cameraFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      stream_frame_width: camera.stream_frame_width,
      stream_frame_height: camera.stream_frame_height,
      stream_max_length: camera.stream_max_length,
      stream_quality: camera.stream_quality,
      stream_fps: camera.stream_fps,
      stream_skip_frames: camera.stream_skip_frames,
      tags: camera.tags || [],
    },
  })

  const { reset } = form

  const onSubmit = (values: CameraFormValues) => {
    const { ...restValues } = values
    updateCamera(
      {
        id: camera.id,
        data: {
          ...restValues,
          tags: selectedTags.map((tag) => tag.id),
          stream_frame_width: values.stream_frame_width ?? undefined,
          stream_frame_height: values.stream_frame_height ?? undefined,
          stream_max_length: values.stream_max_length ?? undefined,
          stream_quality: values.stream_quality ?? undefined,
          stream_fps: values.stream_fps ?? undefined,
          stream_skip_frames: values.stream_skip_frames ?? undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(`/${camera.id}`)
        },
        onError: (error) => {
          console.error('Error updating camera:', error)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Camera Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter camera name"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter a unique name for this camera</FormDescription>
              <FormMessage className="text-xs text-red-600 mt-1" />
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
                <Input
                  placeholder="rtsp://example.com/stream"
                  {...field}
                />
              </FormControl>
              <FormDescription>RTSP stream URL for the camera</FormDescription>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_frame_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frame Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Width (1-2560)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Width in pixels (1-2560)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
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
                  <Input
                    type="number"
                    placeholder="Height (1-2560)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Height in pixels (1-2560)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_fps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FPS</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="FPS (1-120)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Frames per second (1-120)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stream_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quality (80-100)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Stream quality (80-100)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_max_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max length (0-10000)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Maximum stream length (0-10000)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
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
                  <Input
                    type="number"
                    placeholder="Skip frames (0-100)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  />
                </FormControl>
                <FormDescription>Number of frames to skip (0-100)</FormDescription>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tags.map((tag) => ({
                    value: tag.id,
                    label: tag.name,
                  }))}
                  selected={selectedTags.map((tag) => tag.id)}
                  onChange={(tagIds) => {
                    const newTags = tagIds.map((id) => tags.find((tag) => tag.id === id)!).filter(Boolean)
                    setSelectedTags(newTags)
                  }}
                  placeholder="Select tags"
                />
              </FormControl>
              <FormDescription>Select tags for this camera</FormDescription>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
