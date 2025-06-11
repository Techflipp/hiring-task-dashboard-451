import { z } from 'zod';

export const DEMOGRAPHIC_SCHEMA = z.object({
  id: z.string(),
  camera_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  track_history_max_length: z.number().int(),
  exit_threshold: z.number().int(),
  min_track_duration: z.number().int(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0),
  min_track_updates: z.number().int(),
  box_area_threshold: z.number().min(0.05).max(1.0),
  save_interval: z.number().int().min(300).max(1800),
  frame_skip_interval: z.number().min(0.1).max(5),
});

export type SchemaType = z.infer<typeof DEMOGRAPHIC_SCHEMA>;
