import { z } from 'zod';

import { DEMOGRAPHIC_SCHEMA } from './demographics.schema';

export const CAMERA_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  rtsp_url: z.string(),
  tags: z.array(z.object({ id: z.string(), name: z.string(), color: z.string() })), // Define object structure inside if known
  is_active: z.boolean(),
  status_message: z.string(),
  snapshot: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  stream_frame_width: z.number().int(),
  stream_frame_height: z.number().int(),
  stream_max_length: z.number().int(),
  stream_quality: z.number().int(),
  stream_fps: z.number().int(),
  stream_skip_frames: z.number().int(),
  demographics_config: DEMOGRAPHIC_SCHEMA,
});

export type CameraType = z.infer<typeof CAMERA_SCHEMA>;
