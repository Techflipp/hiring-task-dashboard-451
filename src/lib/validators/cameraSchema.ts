import { z } from "zod";

export const cameraFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rtsp_url: z.string().url("Must be a valid RTSP URL"),
  stream_frame_width: z.number().min(1).max(2560).optional(),
  stream_frame_height: z.number().min(1).max(2560).optional(),
  stream_max_length: z.number().min(0).max(10000).optional(),
  stream_quality: z.number().min(80).max(100).optional(),
  stream_fps: z.number().min(1).max(120).optional(),
  stream_skip_frames: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

export type CameraFormValues = z.infer<typeof cameraFormSchema>;
