import { z } from 'zod';

export const GetDemographicsInputSchema = z.object({
  camera_id: z.string().min(1, 'camera_id is required'),
  gender: z.string().optional(),
  age: z.string().optional(),
  emotion: z.string().optional(),
  ethnicity: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type GetDemographicsInput = z.infer<typeof GetDemographicsInputSchema>;

export const EditCameraDemographicsConfigSchema = z.object({
  track_history_max_length: z.number().min(0, 'Must be 0 or more'),
  exit_threshold: z.number().min(0, 'Must be 0 or more'),
  min_track_duration: z.number().min(0, 'Must be 0 or more'),
  detection_confidence_threshold: z.number().min(0, 'Min is 0').max(1, 'Max is 1'),
  demographics_confidence_threshold: z.number().min(0, 'Min is 0').max(1, 'Max is 1'),
  min_track_updates: z.number().min(0, 'Must be 0 or more'),
  box_area_threshold: z.number().min(0, 'Min is 0').max(1, 'Max is 1'),
  save_interval: z.number().min(0, 'Must be 0 or more'),
  frame_skip_interval: z.number().min(0, 'Min is 0').max(1, 'Max is 1'),
});

export type EditCameraDemographicsConfigInput = z.infer<typeof EditCameraDemographicsConfigSchema>;
