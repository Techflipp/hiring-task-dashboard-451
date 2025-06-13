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
