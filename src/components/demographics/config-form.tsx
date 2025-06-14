'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import type { Camera, DemographicsConfig } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateDemographicsConfig, useUpdateDemographicsConfig } from '@/hooks/use-demographics'
import { Slider } from '@/components/ui/slider'
import { configFormSchema, type ConfigFormValues } from '@/schemas/configForm.schema'
import { cn } from '@/lib/utils'

export const ConfigForm = ({ camera, config }: { camera: Camera; config?: DemographicsConfig }) => {
  const router = useRouter()
  const { mutate: createConfig, isPending: isCreating } = useCreateDemographicsConfig()
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateDemographicsConfig()
  const isPending = isCreating || isUpdating
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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

  const { reset, formState: { errors, isValid, touchedFields } } = form

  const getFieldValidationState = (fieldName: keyof ConfigFormValues) => {
    const hasError = errors[fieldName]
    const isTouched = touchedFields[fieldName]

    if (hasError && (isTouched || submitAttempted)) return 'error'
    return 'default'
  }

  const onSubmit = async (values: ConfigFormValues) => {
    setSubmitAttempted(true)

    const submitData = {
      track_history_max_length: values.track_history_max_length ?? undefined,
      exit_threshold: values.exit_threshold ?? undefined,
      min_track_duration: values.min_track_duration ?? undefined,
      detection_confidence_threshold: values.detection_confidence_threshold ?? undefined,
      demographics_confidence_threshold: values.demographics_confidence_threshold ?? undefined,
      min_track_updates: values.min_track_updates ?? undefined,
      box_area_threshold: values.box_area_threshold ?? undefined,
      save_interval: values.save_interval ?? undefined,
      frame_skip_interval: values.frame_skip_interval ?? undefined,
    }

    if (config) {
      updateConfig(
        { id: config.id, data: submitData },
        {
          onSuccess: () => router.push(`/${camera.id}`),
          onError: (error) => {
            console.error('Error updating config:', error)
          },
        }
      )
    } else {
      createConfig(
        { camera_id: camera.id, ...submitData },
        {
          onSuccess: () => router.push(`/${camera.id}`),
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
        className="space-y-6"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="detection_confidence_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detection Confidence Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={0.1}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.1}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className={cn(
                        getFieldValidationState('detection_confidence_threshold') === 'error' && 'border-red-500 focus:border-red-500'
                      )}
                    />
                    <div className="text-xs text-muted-foreground">
                      Current value: {field.value || 0.5}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Threshold for detection confidence (0.1-1.0). Higher values require more confident detections.
                </FormDescription>
                <FormMessage className="text-red-600" />
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
                  <div className="space-y-3">
                    <Slider
                      min={0.1}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.1}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className={cn(
                        getFieldValidationState('demographics_confidence_threshold') === 'error' && 'border-red-500 focus:border-red-500'
                      )}
                    />
                    <div className="text-xs text-muted-foreground">
                      Current value: {field.value || 0.5}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Threshold for demographics confidence (0.1-1.0).
                </FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('track_history_max_length') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={100}
                  />
                </FormControl>
                <FormDescription>Maximum length of track history (1-100)</FormDescription>
                <FormMessage className="text-red-600" />
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('exit_threshold') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={300}
                  />
                </FormControl>
                <FormDescription>Exit threshold in frames (1-300)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('min_track_duration') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={60}
                  />
                </FormControl>
                <FormDescription>Minimum track duration in seconds (1-60)</FormDescription>
                <FormMessage className="text-red-600" />
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('min_track_updates') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={1}
                    max={100}
                  />
                </FormControl>
                <FormDescription>Minimum track updates (1-100)</FormDescription>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="box_area_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box Area Threshold</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={0.05}
                      max={1.0}
                      step={0.01}
                      value={[field.value || 0.1]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      step={0.01}
                      min={0.05}
                      max={1.0}
                      {...field}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className={cn(
                        getFieldValidationState('box_area_threshold') === 'error' && 'border-red-500 focus:border-red-500'
                      )}
                    />
                    <div className="text-xs text-muted-foreground">
                      Current value: {field.value || 0.1}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Box area threshold (0.05-1.0)</FormDescription>
                <FormMessage className="text-red-600" />
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
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('save_interval') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                    min={300}
                    max={1800}
                  />
                </FormControl>
                <FormDescription>Save interval in seconds (300-1800 / 5-30 minutes)</FormDescription>
                <FormMessage className="text-red-600" />
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
                <div className="space-y-3">
                  <Slider
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    value={[field.value || 1.0]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    step={0.1}
                    min={0.1}
                    max={5.0}
                    {...field}
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    className={cn(
                      getFieldValidationState('frame_skip_interval') === 'error' && 'border-red-500 focus:border-red-500'
                    )}
                  />
                  <div className="text-xs text-muted-foreground">
                    Current value: {field.value || 1.0}
                  </div>
                </div>
              </FormControl>
              <FormDescription>Frame skip interval in seconds (0.1-5.0)</FormDescription>
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
              config ? 'Update Configuration' : 'Create Configuration'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
