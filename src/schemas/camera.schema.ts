import { z } from 'zod'

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const DemographicsConfigSchema = z.object({
  id: z.string(),
  camera_id: z.string(),
  track_history_max_length: z.number().int().min(1).max(100).optional().nullable(),
  exit_threshold: z.number().int().min(1).max(300).optional().nullable(),
  min_track_duration: z.number().int().min(1).max(60).optional().nullable(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional().nullable(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional().nullable(),
  min_track_updates: z.number().int().min(1).max(100).optional().nullable(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional().nullable(),
  save_interval: z.number().int().min(300).max(1800).optional().nullable(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export const CameraSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Camera name is required'),
  rtsp_url: z.string().min(1, 'RTSP URL is required').url('Must be a valid URL'),
  stream_frame_width: z.number().int().min(1).max(2560).optional().nullable(),
  stream_frame_height: z.number().int().min(1).max(2560).optional().nullable(),
  stream_max_length: z.number().int().min(0).max(10000).optional().nullable(),
  stream_quality: z.number().int().min(80).max(100).optional().nullable(),
  stream_fps: z.number().int().min(1).max(120).optional().nullable(),
  stream_skip_frames: z.number().int().min(0).max(100).optional().nullable(),
  tags: z.array(TagSchema).optional().nullable(),
  demographics_config: DemographicsConfigSchema.optional().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
})

export type Camera = z.infer<typeof CameraSchema>
export type Tag = z.infer<typeof TagSchema>
export type DemographicsConfig = z.infer<typeof DemographicsConfigSchema>

export const CameraListResponseSchema = z.object({
  items: z.array(CameraSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  pages: z.number(),
})

export type CameraListResponse = z.infer<typeof CameraListResponseSchema>
