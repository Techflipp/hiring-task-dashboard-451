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
