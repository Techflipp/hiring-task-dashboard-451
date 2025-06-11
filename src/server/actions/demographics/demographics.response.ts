import { z } from 'zod';

import { DEMOGRAPHIC_SCHEMA } from '@/server/schemas/demographics.schema';

export const AnalyticsItemSchema = z.object({
  count: z.number(),
  gender: z.string(),
  age: z.string(),
  emotion: z.string(),
  ethnicity: z.string(),
  id: z.string(),
  config_id: z.string(),
  created_at: z.string().datetime(),
});

const DistributionSchema = z.record(z.number());

export const AnalyticsSummarySchema = z.object({
  gender_distribution: DistributionSchema,
  age_distribution: DistributionSchema,
  emotion_distribution: DistributionSchema,
  ethnicity_distribution: DistributionSchema,
  total_count: z.number(),
});

export const DemographicsDetailsResponseSchema = z.object({
  items: z.array(AnalyticsItemSchema),
  analytics: AnalyticsSummarySchema,
});

export type DemographicsDetailsResponseType = z.infer<typeof DemographicsDetailsResponseSchema>;

export const CameraDemographicsConfigResponseSchema = DEMOGRAPHIC_SCHEMA;

export type CameraDemographicsConfigResponseType = z.infer<
  typeof CameraDemographicsConfigResponseSchema
>;
