'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import type { Camera, Tag } from '@/lib/types'
import { useUpdateCamera } from '@/hooks/use-cameras'
import { CameraSchema } from '@/schemas/camera.schema'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { cn } from '@/lib/utils'

// Create a form schema that omits the fields we don't need for the form
const CameraFormSchema = CameraSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  status: true,
  demographics_config: true,
})

type CameraFormValues = {
  name: string
  rtsp_url: string
  stream_frame_width?: number | null
  stream_frame_height?: number | null
  stream_max_length?: number | null
  stream_quality?: number | null
  stream_fps?: number | null
  stream_skip_frames?: number | null
  tags?: Tag[] | null
}

export const CameraForm = ({ camera, tags }: { camera: Camera; tags: Tag[] }) => {
  const router = useRouter()
  const { mutate: updateCamera, isPending } = useUpdateCamera()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const form = useForm<CameraFormValues>({
    resolver: zodResolver(CameraFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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

  const {
    reset,
    formState: { errors, isValid, touchedFields },
  } = form

  const onSubmit = async (values: CameraFormValues) => {
    setSubmitAttempted(true)

    updateCamera(
      {
        id: camera.id,
        data: {
          name: values.name.trim(),
          rtsp_url: values.rtsp_url.trim(),
          tags: values.tags?.map((tag) => tag.id) || [],
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

  const getFieldValidationState = (fieldName: keyof CameraFormValues) => {
    const hasError = errors[fieldName]
    const isTouched = touchedFields[fieldName]
    const value = form.watch(fieldName)

    if (hasError && (isTouched || submitAttempted)) return 'error'
    if (isTouched && value && !hasError) return 'success'
    return 'default'
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Camera Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter camera name"
                  {...field}
                  className={cn(getFieldValidationState('name') === 'error' && 'border-red-500 focus:border-red-500')}
                  maxLength={100}
                />
              </FormControl>
              <FormDescription>Enter a unique name for this camera (required)</FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rtsp_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                RTSP URL
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="rtsp://example.com/stream"
                  {...field}
                  className={cn(
                    getFieldValidationState('rtsp_url') === 'error' && 'border-red-500 focus:border-red-500'
                  )}
                />
              </FormControl>
              <FormDescription>RTSP stream URL for the camera (required, must be a valid URL)</FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_frame_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Frame Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Width (1-2560)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_frame_width') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={2560}
                  />
                </FormControl>
                <FormDescription>Width in pixels (1-2560)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stream_frame_height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Frame Height</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Height (1-2560)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_frame_height') === 'error' &&
                        'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={2560}
                  />
                </FormControl>
                <FormDescription>Height in pixels (1-2560)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_fps"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">FPS</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="FPS (1-120)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_fps') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={120}
                  />
                </FormControl>
                <FormDescription>Frames per second (1-120)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stream_quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Quality</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Quality (80-100)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_quality') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={80}
                    max={100}
                  />
                </FormControl>
                <FormDescription>Stream quality (80-100)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stream_max_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Max Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Max length (0-10000)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_max_length') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={0}
                    max={10000}
                  />
                </FormControl>
                <FormDescription>Maximum stream length (0-10000)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stream_skip_frames"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">Skip Frames</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Skip frames (0-100)"
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value ? Number(value) : null)
                    }}
                    className={cn(
                      getFieldValidationState('stream_skip_frames') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={0}
                    max={100}
                  />
                </FormControl>
                <FormDescription>Number of frames to skip (0-100)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tags.map((tag) => ({
                    value: tag.id,
                    label: tag.name,
                  }))}
                  selected={field.value?.map((tag) => tag.id) || []}
                  onChange={(tagIds) => {
                    const selectedTags = tagIds
                      .map((id) => tags.find((tag) => tag.id === id))
                      .filter((tag): tag is Tag => tag !== undefined)
                    field.onChange(selectedTags)
                  }}
                  placeholder="Select tags"
                />
              </FormControl>
              <FormDescription>Select tags for this camera (optional)</FormDescription>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
              setSubmitAttempted(false)
            }}
            className="w-full sm:w-auto"
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending || !isValid}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
