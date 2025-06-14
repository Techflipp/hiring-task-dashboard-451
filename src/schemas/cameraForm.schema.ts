import { z } from 'zod'
import { TagSchema } from './camera.schema'

export const cameraFormSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  rtsp_url: z.string().min(1, 'RTSP URL is required'),
  stream_frame_width: z.coerce
    .number()
    .int()
    .min(1, 'Width must be at least 1')
    .max(2560, 'Width must be at most 2560')
    .optional()
    .nullable(),
  stream_frame_height: z.coerce
    .number()
    .int()
    .min(1, 'Height must be at least 1')
    .max(2560, 'Height must be at most 2560')
    .optional()
    .nullable(),
  stream_max_length: z.coerce
    .number()
    .int()
    .min(0, 'Max length must be at least 0')
    .max(10000, 'Max length must be at most 10000')
    .optional()
    .nullable(),
  stream_quality: z.coerce
    .number()
    .int()
    .min(80, 'Quality must be at least 80')
    .max(100, 'Quality must be at most 100')
    .optional()
    .nullable(),
  stream_fps: z.coerce
    .number()
    .int()
    .min(1, 'FPS must be at least 1')
    .max(120, 'FPS must be at most 120')
    .optional()
    .nullable(),
  stream_skip_frames: z.coerce
    .number()
    .int()
    .min(0, 'Skip frames must be at least 0')
    .max(100, 'Skip frames must be at most 100')
    .optional()
    .nullable(),
  tags: z.array(TagSchema).optional(),
})

export type CameraFormValues = z.infer<typeof cameraFormSchema>

// Schema for updating camera values - uses string array for tags to match UI expectations
export const updateCameraValuesSchema = z.object({
  name: z.string().min(1, 'Camera name is required').optional(),
  rtsp_url: z.string().min(1, 'RTSP URL is required').optional(),
  stream_frame_width: z.coerce
    .number()
    .int()
    .min(1, 'Width must be at least 1')
    .max(2560, 'Width must be at most 2560')
    .optional()
    .nullable(),
  stream_frame_height: z.coerce
    .number()
    .int()
    .min(1, 'Height must be at least 1')
    .max(2560, 'Height must be at most 2560')
    .optional()
    .nullable(),
  stream_max_length: z.coerce
    .number()
    .int()
    .min(0, 'Max length must be at least 0')
    .max(10000, 'Max length must be at most 10000')
    .optional()
    .nullable(),
  stream_quality: z.coerce
    .number()
    .int()
    .min(80, 'Quality must be at least 80')
    .max(100, 'Quality must be at most 100')
    .optional()
    .nullable(),
  stream_fps: z.coerce
    .number()
    .int()
    .min(1, 'FPS must be at least 1')
    .max(120, 'FPS must be at most 120')
    .optional()
    .nullable(),
  stream_skip_frames: z.coerce
    .number()
    .int()
    .min(0, 'Skip frames must be at least 0')
    .max(100, 'Skip frames must be at most 100')
    .optional()
    .nullable(),
  tags: z.array(z.string()).optional(), // Tag IDs as strings
})

export type UpdateCameraValues = z.infer<typeof updateCameraValuesSchema>
