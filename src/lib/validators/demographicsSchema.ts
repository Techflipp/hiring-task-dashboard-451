import { z } from 'zod'

export const demographicsConfigSchema = z.object({
  track_history_max_length: z.number().min(1).max(100),
  exit_threshold: z.number().min(1).max(300),
  min_track_duration: z.number().min(1).max(60),
  detection_confidence_threshold: z.number().min(0.1).max(1.0),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0),
  min_track_updates: z.number().min(1).max(100),
  box_area_threshold: z.number().min(0.05).max(1.0),
  save_interval: z.number().min(300).max(1800),
  frame_skip_interval: z.number().min(0.1).max(5.0),
})

export type DemographicsFormValues = z.infer<typeof demographicsConfigSchema>
