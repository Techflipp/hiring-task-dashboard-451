import { z } from 'zod';

export const filterSchema = z.object({
  gender: z.string().optional(),
  age: z.string().optional(),
  emotion: z.string().optional(),
  ethnicity: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  camera_id: z.string()
});

export type FilterForm = z.infer<typeof filterSchema>;
