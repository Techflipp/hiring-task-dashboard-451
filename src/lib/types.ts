// Re-export all types from schemas to maintain consistency
export type { Camera, Tag, DemographicsConfig, CameraListResponse } from '@/schemas/camera.schema'

export type { CameraFormValues } from '@/schemas/cameraForm.schema'

export type {
  ConfigFormValues,
  CreateDemographicsConfigValues,
  UpdateDemographicsConfigValues,
} from '@/schemas/configForm.schema'

export type {
  ApiError,
  DemographicsResult,
  DemographicsFilters,
  TimeSeriesData,
  DemographicsAnalytics,
  DemographicsResultsResponse,
} from '@/schemas/api.schema'

// Keep the enums for backward compatibility
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Age {
  ZERO_EIGHTEEN = '0-18',
  NINETEEN_THIRTY = '19-30',
  THIRTYONE_FORTYFIVE = '31-45',
  FORTYSIX_SIXTY = '46-60',
  SIXTYPLUS = '60+',
}

export enum Emotion {
  ANGRY = 'angry',
  FEAR = 'fear',
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad',
  SURPRISE = 'surprise',
}

export enum EthnicGroup {
  WHITE = 'white',
  AFRICAN = 'african',
  SOUTH_ASIAN = 'south_asian',
  EAST_ASIAN = 'east_asian',
  MIDDLE_EASTERN = 'middle_eastern',
}

// Additional helper types
export type PaginationMeta = {
  total: number
  page: number
  size: number
  pages: number
  has_next: boolean
  has_prev: boolean
}

export interface PeakHoursData {
  hour: number
  count: number
  primary_demographic: {
    gender: Gender
    age: Age
    emotion: Emotion
  }
}

export interface DemographicsCombination {
  gender: Gender
  age: Age
  emotion: Emotion
  ethnicity: EthnicGroup
  count: number
  percentage: number
}

export interface ConfidenceDistribution {
  detection_confidence: ConfidenceRange[]
  demographics_confidence: ConfidenceRange[]
}

export interface ConfidenceRange {
  range: string
  count: number
  percentage: number
}

export interface TrendAnalysis {
  gender_trends: TrendData[]
  age_trends: TrendData[]
  emotion_trends: TrendData[]
  growth_rates: GrowthRates
}

export interface TrendData {
  category: string
  data: { timestamp: string; count: number; change_percentage: number }[]
}

export interface GrowthRates {
  overall: number
  by_gender: Record<Gender, number>
  by_age: Record<Age, number>
  by_emotion: Record<Emotion, number>
}

export interface ComparativeAnalytics {
  weekday_vs_weekend: {
    weekday: DemographicsDistribution
    weekend: DemographicsDistribution
  }
  day_vs_night: {
    day: DemographicsDistribution
    night: DemographicsDistribution
  }
}

export interface DemographicsDistribution {
  total_count: number
  gender_distribution: Record<Gender, number>
  age_distribution: Record<Age, number>
  emotion_distribution: Record<Emotion, number>
  ethnicity_distribution: Record<EthnicGroup, number>
}

export interface HourlyDistribution {
  hour: number
  count: number
  dominant_emotion: Emotion
  dominant_age: Age
}

export interface DailyDistribution {
  day: string
  count: number
  peak_hour: number
  dominant_demographics: {
    gender: Gender
    age: Age
    emotion: Emotion
    ethnicity: EthnicGroup
  }
}

export interface CorrelationMatrix {
  age_emotion: Record<Age, Record<Emotion, number>>
  gender_emotion: Record<Gender, Record<Emotion, number>>
  ethnicity_emotion: Record<EthnicGroup, Record<Emotion, number>>
}

// Enhanced analytics that extends the base analytics with additional computed data
export interface EnhancedDemographicsAnalytics {
  peak_hours: PeakHoursData[]
  demographics_combinations: DemographicsCombination[]
  confidence_distribution: ConfidenceDistribution
  trend_analysis: TrendAnalysis
  comparative_analytics: ComparativeAnalytics
  hourly_distribution: HourlyDistribution[]
  daily_distribution: DailyDistribution[]
  correlation_matrix: CorrelationMatrix
}
