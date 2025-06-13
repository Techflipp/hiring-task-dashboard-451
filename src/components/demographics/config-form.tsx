'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Camera, DemographicsConfig } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateDemographicsConfig, useUpdateDemographicsConfig } from '@/hooks/use-demographics'
import { useRouter } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { configFormSchema, type ConfigFormValues } from '@/schemas/configForm.schema'

export const ConfigForm = ({ camera, config }: { camera: Camera; config?: DemographicsConfig }) => {
  const router = useRouter()
  const { mutate: createConfig, isPending: isCreating } = useCreateDemographicsConfig()
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateDemographicsConfig()
  const isPending = isCreating || isUpdating

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      track_history_max_length: config?.track_history_max_length || 50,
      exit_threshold: config?.exit_threshold || 30,
      min_track_duration: config?.min_track_duration || 5,
      detection_confidence_threshold: config?.detection_confidence_threshold || 0.5,
      demographics_confidence_threshold: config?.demographics_confidence_threshold || 0.5,
      min_track_updates: config?.min_track_updates || 10,
      box_area_threshold: config?.box_area_threshold || 0.1,
      save_interval: config?.save_interval || 600,
      frame_skip_interval: config?.frame_skip_interval || 1.0,
    },
  })
  const { reset } = form

  const onSubmit = async (values: ConfigFormValues) => {
    if (config) {
      updateConfig(
        {
          id: config.id,
          data: {
            track_history_max_length: values.track_history_max_length ?? undefined,
            exit_threshold: values.exit_threshold ?? undefined,
            min_track_duration: values.min_track_duration ?? undefined,
            detection_confidence_threshold: values.detection_confidence_threshold ?? undefined,
            demographics_confidence_threshold: values.demographics_confidence_threshold ?? undefined,
            min_track_updates: values.min_track_updates ?? undefined,
            box_area_threshold: values.box_area_threshold ?? undefined,
            save_interval: values.save_interval ?? undefined,
            frame_skip_interval: values.frame_skip_interval ?? undefined,
          },
        },
        {
          onSuccess: () => {
            router.push(`/${camera.id}`)
          },
          onError: (error) => {
            console.error('Error updating config:', error)
          },
        }
      )
    } else {
      createConfig(
        {
          camera_id: camera.id,
          track_history_max_length: values.track_history_max_length ?? undefined,
          exit_threshold: values.exit_threshold ?? undefined,
          min_track_duration: values.min_track_duration ?? undefined,
          detection_confidence_threshold: values.detection_confidence_threshold ?? undefined,
          demographics_confidence_threshold: values.demographics_confidence_threshold ?? undefined,
          min_track_updates: values.min_track_updates ?? undefined,
          box_area_threshold: values.box_area_threshold ?? undefined,
          save_interval: values.save_interval ?? undefined,
          frame_skip_interval: values.frame_skip_interval ?? undefined,
        },
        {
          onSuccess: () => {
            router.push(`/${camera.id}`)
          },
          onError: (error) => {
            console.error('Error creating config:', error)
          },
        }
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="detection_confidence_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detection Confidence Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0.1}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.5]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.1}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                    />
                  </div>
                </FormControl>
                <FormDescription>Threshold for detection confidence (0.1-1.0)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="demographics_confidence_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demographics Confidence Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0.1}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.5]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.1}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                    />
                  </div>
                </FormControl>
                <FormDescription>Threshold for demographics confidence (0.1-1.0)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="track_history_max_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track History Max Length</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1-100"
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </FormControl>
                <FormDescription>Maximum length of track history (1-100)</FormDescription>
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
                  <Input
                    type="number"
                    placeholder="1-300"
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </FormControl>
                <FormDescription>Exit threshold in frames (1-300)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="min_track_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Track Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1-60"
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </FormControl>
                <FormDescription>Minimum track duration in seconds (1-60)</FormDescription>
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
                  <Input
                    type="number"
                    placeholder="1-100"
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </FormControl>
                <FormDescription>Minimum track updates (1-100)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="box_area_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box Area Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      min={0.05}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.1]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.05}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                    />
                  </div>
                </FormControl>
                <FormDescription>Box area threshold (0.05-1.0)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="save_interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Save Interval</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="300-1800"
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </FormControl>
                <FormDescription>Save interval in seconds (300-1800)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="frame_skip_interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frame Skip Interval</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    value={[field.value || 1.0]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <Input
                    type="number"
                    step={0.1}
                    min={0.1}
                    max={5.0}
                    {...field}
                    value={field.value?.toString() || ''}
                  />
                </div>
              </FormControl>
              <FormDescription>Frame skip interval in seconds (0.1-5.0)</FormDescription>
              <FormMessage />
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
            {isPending ? 'Saving...' : config ? 'Update Configuration' : 'Create Configuration'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
