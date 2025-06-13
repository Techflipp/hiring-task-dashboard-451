import { z } from 'zod'

export const configFormSchema = z.object({
  track_history_max_length: z.coerce
    .number()
    .int()
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100')
    .optional()
    .nullable(),
  exit_threshold: z.coerce
    .number()
    .int()
    .min(1, 'Must be at least 1')
    .max(300, 'Must be at most 300')
    .optional()
    .nullable(),
  min_track_duration: z.coerce
    .number()
    .int()
    .min(1, 'Must be at least 1')
    .max(60, 'Must be at most 60')
    .optional()
    .nullable(),
  detection_confidence_threshold: z.coerce
    .number()
    .min(0.1, 'Must be at least 0.1')
    .max(1.0, 'Must be at most 1.0')
    .optional()
    .nullable(),
  demographics_confidence_threshold: z.coerce
    .number()
    .min(0.1, 'Must be at least 0.1')
    .max(1.0, 'Must be at most 1.0')
    .optional()
    .nullable(),
  min_track_updates: z.coerce
    .number()
    .int()
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100')
    .optional()
    .nullable(),
  box_area_threshold: z.coerce
    .number()
    .min(0.05, 'Must be at least 0.05')
    .max(1.0, 'Must be at most 1.0')
    .optional()
    .nullable(),
  save_interval: z.coerce
    .number()
    .int()
    .min(300, 'Must be at least 300')
    .max(1800, 'Must be at most 1800')
    .optional()
    .nullable(),
  frame_skip_interval: z.coerce
    .number()
    .min(0.1, 'Must be at least 0.1')
    .max(5.0, 'Must be at most 5.0')
    .optional()
    .nullable(),
})

export type ConfigFormValues = z.infer<typeof configFormSchema>

export const createDemographicsConfigSchema = configFormSchema.extend({
  camera_id: z.string().min(1, 'Camera ID is required'),
})

export type CreateDemographicsConfigValues = z.infer<typeof createDemographicsConfigSchema>

export const updateDemographicsConfigSchema = configFormSchema.extend({
  id: z.string().min(1, 'Config ID is required'),
})

export type UpdateDemographicsConfigValues = z.infer<typeof updateDemographicsConfigSchema>
