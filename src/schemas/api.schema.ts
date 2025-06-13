import { z } from 'zod'
import { CameraSchema, CameraListResponseSchema } from './camera.schema'

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.array(z.string())).optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

export const GenderSchema = z.enum(['male', 'female'])
export const AgeSchema = z.enum(['0-18', '19-30', '31-45', '46-60', '60+'])
export const EmotionSchema = z.enum(['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise'])
export const EthnicGroupSchema = z.enum(['white', 'african', 'south_asian', 'east_asian', 'middle_eastern'])

export const DemographicsResultSchema = z.object({
  id: z.string(),
  camera_id: z.string(),
  timestamp: z.string(),
  gender: GenderSchema.nullable(),
  age: AgeSchema.nullable(),
  emotion: EmotionSchema.nullable(),
  ethnicity: EthnicGroupSchema.nullable(),
  gender_confidence: z.number().optional(),
  age_confidence: z.number().optional(),
  emotion_confidence: z.number().optional(),
  ethnicity_confidence: z.number().optional(),
})

export const DemographicsFiltersSchema = z.object({
  camera_id: z.string(),
  gender: GenderSchema.optional(),
  age: AgeSchema.optional(),
  emotion: EmotionSchema.optional(),
  ethnicity: EthnicGroupSchema.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export const TimeSeriesDataSchema = z.object({
  timestamp: z.string(),
  count: z.number(),
})

export const DemographicsAnalyticsSchema = z.object({
  total_count: z.number(),
  gender_distribution: z.record(z.number()),
  age_distribution: z.record(z.number()),
  emotion_distribution: z.record(z.number()),
  ethnicity_distribution: z.record(z.number()),
  time_series_data: z.array(TimeSeriesDataSchema),
})

export const DemographicsResultsResponseSchema = z.object({
  results: z.array(DemographicsResultSchema),
  analytics: DemographicsAnalyticsSchema,
})

export type Gender = z.infer<typeof GenderSchema>
export type Age = z.infer<typeof AgeSchema>
export type Emotion = z.infer<typeof EmotionSchema>
export type EthnicGroup = z.infer<typeof EthnicGroupSchema>
export type DemographicsResult = z.infer<typeof DemographicsResultSchema>
export type DemographicsFilters = z.infer<typeof DemographicsFiltersSchema>
export type TimeSeriesData = z.infer<typeof TimeSeriesDataSchema>
export type DemographicsAnalytics = z.infer<typeof DemographicsAnalyticsSchema>
export type DemographicsResultsResponse = z.infer<typeof DemographicsResultsResponseSchema>

export const createApiResponse = <T extends z.ZodType>(dataSchema: T) => {
  return z.union([dataSchema, ApiErrorSchema])
}

export const CameraResponseSchema = createApiResponse(CameraSchema)
export const CameraListApiResponseSchema = createApiResponse(CameraListResponseSchema)
export const DemographicsResultsApiResponseSchema = createApiResponse(DemographicsResultsResponseSchema)
