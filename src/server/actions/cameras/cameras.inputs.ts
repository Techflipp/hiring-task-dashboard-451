import { z } from 'zod';

export const GetCamerasListInputSchema = z.object({
  camera_name: z.string().default('camera_name'),
  page: z.number().int().min(1, { message: 'Page must be at least 1' }).default(1),
  size: z
    .number()
    .int()
    .min(1, { message: 'Size must be at least 1' })
    .max(100, { message: 'Size must be at most 100' }),
});

export type GetCamerasListInput = z.infer<typeof GetCamerasListInputSchema>;

export const GetCameraByIdInputSchema = z.object({
  camera_id: z.string().min(1),
});

export type GetCameraByIdInput = z.infer<typeof GetCameraByIdInputSchema>;

export const EditCameraDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rtsp_url: z.string().url('RTSP URL must be a valid URL'),
  stream_frame_width: z.number().int().min(1, 'Width must be greater than 0'),
  stream_frame_height: z.number().int().min(1, 'Height must be greater than 0'),
  stream_max_length: z.number().int().min(1, 'Max length must be greater than 0'),
  stream_quality: z.number().int().min(1, 'Quality must be greater than 0'),
  stream_fps: z.number().int().min(1, 'FPS must be greater than 0'),
  stream_skip_frames: z.number().int().min(0, 'Skip frames cannot be negative'),
  tags: z.array(z.string()).nonempty('At least one tag is required'),
});

export type EditCameraDetailsInput = z.infer<typeof EditCameraDetailsSchema>;
