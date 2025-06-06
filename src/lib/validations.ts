import { z } from "zod";

export const cameraUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rtsp_url: z.string().url("Must be a valid URL"),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export const demographicsConfigSchema = z.object({
  camera_id: z.string(),
  track_history_max_length: z.number().min(1).max(100).optional(),
  exit_threshold: z.number().min(1).max(300).optional(),
  min_track_duration: z.number().min(1).max(60).optional(),
  detection_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  demographics_confidence_threshold: z.number().min(0.1).max(1.0).optional(),
  min_track_updates: z.number().min(1).max(100).optional(),
  box_area_threshold: z.number().min(0.05).max(1.0).optional(),
  save_interval: z.number().min(300).max(1800).optional(),
  frame_skip_interval: z.number().min(0.1).max(5.0).optional(),
});

export const demographicsConfigUpdateSchema = demographicsConfigSchema.omit({
  camera_id: true,
});

export type CameraUpdateFormData = z.infer<typeof cameraUpdateSchema>;
export type DemographicsConfigFormData = z.infer<
  typeof demographicsConfigSchema
>;
export type DemographicsConfigUpdateFormData = z.infer<
  typeof demographicsConfigUpdateSchema
>;
