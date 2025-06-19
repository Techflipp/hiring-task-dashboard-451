'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { demographicsConfigSchema, DemographicsFormValues } from '@/lib/validators/demographicsSchema'
import { useCameraDetail, useUpsertDemographicsConfig } from '@/hooks/useCamera'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export const DemographicsConfigForm = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data, isLoading } = useCameraDetail(id)
  const demographics = data?.demographics_config
  const isEditing = Boolean(demographics?.id)

  const form = useForm<DemographicsFormValues>({
    resolver: zodResolver(demographicsConfigSchema),
    defaultValues: {
      track_history_max_length: 10,
      exit_threshold: 20,
      min_track_duration: 5,
      detection_confidence_threshold: 0.8,
      demographics_confidence_threshold: 0.8,
      min_track_updates: 5,
      box_area_threshold: 0.5,
      save_interval: 600,
      frame_skip_interval: 1,
    },
  })

  // ✅ Reset form when demographics data is loaded
  useEffect(() => {
    if (demographics) {
      form.reset(demographics)
    }
  }, [demographics, form])

  const upsertMutation = useUpsertDemographicsConfig(id, demographics?.id)

  const onSubmit = async (values: DemographicsFormValues) => {
    console.log('Submitting:', values)
    try {
      await upsertMutation.mutateAsync(values)
      router.push(`/cameras/${id}`)
    } catch (error) {
      console.error('Mutation failed', error)
    }
  }

  if (isLoading) return <Skeleton className="h-48 w-full" />

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit' : 'Create'} Demographics Config</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {Object.entries(form.getValues()).filter(([key])=> !["id","camera_id","created_at","updated_at"].includes(key)).map(([key]) => (
            <div key={key} className="flex flex-col gap-1">
              <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
              <Input
                type="number"
                step="any"
                {...form.register(key as keyof DemographicsFormValues, {valueAsNumber: true})}
              />
              {form.formState.errors?.[key as keyof DemographicsFormValues] && (
                <p className="text-sm text-red-500">
                  {form.formState.errors[key as keyof DemographicsFormValues]?.message}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" disabled={upsertMutation.isPending}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
