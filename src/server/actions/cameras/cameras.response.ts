import { z } from 'zod';

import { CAMERA_SCHEMA } from '@/server/schemas/cameras.schema';

export const CamerasListResponseSchema = z.object({
  items: z.array(CAMERA_SCHEMA),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  pages: z.number(),
});

export type CameraListResponseType = z.infer<typeof CamerasListResponseSchema>;

export const CameraDetailsResponseSchema = CAMERA_SCHEMA;

export type CameraDetailsResponseType = z.infer<typeof CameraDetailsResponseSchema>;
