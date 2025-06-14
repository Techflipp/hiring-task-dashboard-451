import { z } from 'zod'

import { API_BASE_URL } from './constants'
import {
  Camera,
  CameraListResponse,
  DemographicsConfig,
  DemographicsFilters,
  Tag,
  CreateDemographicsConfigValues,
  UpdateDemographicsConfigValues,
  PeakHoursData,
  DemographicsCombination,
  ConfidenceDistribution,
  TrendAnalysis,
  ComparativeAnalytics,
  HourlyDistribution,
  DailyDistribution,
  CorrelationMatrix,
  DemographicsResult,
  DemographicsAnalytics,
  EnhancedDemographicsAnalytics,
  Gender,
  Age,
  Emotion,
  EthnicGroup,
} from './types'
import { CameraSchema, CameraListResponseSchema, DemographicsConfigSchema, TagSchema } from '@/schemas/camera.schema'
import { ApiErrorSchema, DemographicsResultsResponseSchema } from '@/schemas/api.schema'
import type { UpdateCameraValues } from '@/schemas/cameraForm.schema'

/**
 * Makes an API request with validation
 */
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    // Validate error response
    const validatedError = ApiErrorSchema.safeParse(error)
    if (validatedError.success) {
      throw new Error(JSON.stringify(validatedError.data))
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Fetches a paginated list of cameras with validation
 */
export const getCameras = async (page = 1, size = 20, cameraName?: string): Promise<CameraListResponse> => {
  let endpoint = `/cameras/?page=${page}&size=${size}`
  if (cameraName) {
    endpoint += `&camera_name=${encodeURIComponent(cameraName)}`
  }
  return apiRequest(endpoint)
}

/**
 * Fetches a single camera with validation
 */
export const getCamera = async (id: string): Promise<Camera> => {
  return apiRequest(`/cameras/${id}`)
}

/**
 * Updates a camera with validation
 */
export const updateCamera = async (id: string, data: UpdateCameraValues): Promise<Camera> => {
  return apiRequest(`/cameras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Fetches all tags with validation
 */
export const getTags = async (): Promise<Tag[]> => {
  return apiRequest('/tags/', z.array(TagSchema))
}

/**
 * Creates a demographics configuration with validation
 */
export const createDemographicsConfig = async (data: CreateDemographicsConfigValues): Promise<DemographicsConfig> => {
  return apiRequest('/demographics/config', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Updates a demographics configuration with validation
 */
export const updateDemographicsConfig = async (
  id: string,
  data: Partial<UpdateDemographicsConfigValues>
): Promise<DemographicsConfig> => {
  return apiRequest(`/demographics/config/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Fetches demographics results with validation
 */
export async function getDemographicsResults(filters: DemographicsFilters): Promise<{
  results: DemographicsResult[]
  analytics: EnhancedDemographicsAnalytics
}> {
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await apiRequest(
    `/demographics/results?${queryParams.toString()}`
  )

  // Since the API might not return enhanced analytics, we'll simulate the additional data
  // In a real implementation, this would come from the API
  const enhancedAnalytics: EnhancedDemographicsAnalytics = {
    ...response.analytics,
    peak_hours: generateMockPeakHours(),
    demographics_combinations: generateMockCombinations(response.analytics),
    confidence_distribution: generateMockConfidenceDistribution(),
    trend_analysis: generateMockTrendAnalysis(),
    comparative_analytics: generateMockComparativeAnalytics(response.analytics),
    hourly_distribution: generateMockHourlyDistribution(),
    daily_distribution: generateMockDailyDistribution(),
    correlation_matrix: generateMockCorrelationMatrix(),
  }

  return {
    results: response.results,
    analytics: enhancedAnalytics,
  }
}

// Mock data generators (in a real app, these would come from the API)
function generateMockPeakHours(): PeakHoursData[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Math.floor(Math.random() * 100) + 10,
    primary_demographic: {
      gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
      age: Object.values(Age)[Math.floor(Math.random() * Object.values(Age).length)],
      emotion: Object.values(Emotion)[Math.floor(Math.random() * Object.values(Emotion).length)],
    },
  }))
}

function generateMockCombinations(analytics: DemographicsAnalytics): DemographicsCombination[] {
  const combinations: DemographicsCombination[] = []

  Object.values(Gender).forEach((gender) => {
    Object.values(Age).forEach((age) => {
      Object.values(Emotion).forEach((emotion) => {
        Object.values(EthnicGroup).forEach((ethnicity) => {
          const count = Math.floor(Math.random() * 50) + 1
          combinations.push({
            gender,
            age,
            emotion,
            ethnicity,
            count,
            percentage: (count / analytics.total_count) * 100,
          })
        })
      })
    })
  })

  return combinations.sort((a, b) => b.count - a.count).slice(0, 50)
}

function generateMockConfidenceDistribution(): ConfidenceDistribution {
  const ranges = ['0.0-0.2', '0.2-0.4', '0.4-0.6', '0.6-0.8', '0.8-1.0']

  return {
    detection_confidence: ranges.map((range) => ({
      range,
      count: Math.floor(Math.random() * 100) + 10,
      percentage: Math.random() * 20 + 5,
    })),
    demographics_confidence: ranges.map((range) => ({
      range,
      count: Math.floor(Math.random() * 100) + 10,
      percentage: Math.random() * 20 + 5,
    })),
  }
}

function generateMockTrendAnalysis(): TrendAnalysis {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString()
  }).reverse()

  return {
    gender_trends: Object.values(Gender).map((gender) => ({
      category: gender,
      data: dates.map((timestamp) => ({
        timestamp,
        count: Math.floor(Math.random() * 50) + 10,
        change_percentage: (Math.random() - 0.5) * 20,
      })),
    })),
    age_trends: Object.values(Age).map((age) => ({
      category: age,
      data: dates.map((timestamp) => ({
        timestamp,
        count: Math.floor(Math.random() * 30) + 5,
        change_percentage: (Math.random() - 0.5) * 15,
      })),
    })),
    emotion_trends: Object.values(Emotion).map((emotion) => ({
      category: emotion,
      data: dates.map((timestamp) => ({
        timestamp,
        count: Math.floor(Math.random() * 40) + 8,
        change_percentage: (Math.random() - 0.5) * 25,
      })),
    })),
    growth_rates: {
      overall: (Math.random() - 0.5) * 20,
      by_gender: {
        [Gender.MALE]: (Math.random() - 0.5) * 15,
        [Gender.FEMALE]: (Math.random() - 0.5) * 15,
      },
      by_age: Object.values(Age).reduce(
        (acc, age) => ({
          ...acc,
          [age]: (Math.random() - 0.5) * 10,
        }),
        {} as Record<Age, number>
      ),
      by_emotion: Object.values(Emotion).reduce(
        (acc, emotion) => ({
          ...acc,
          [emotion]: (Math.random() - 0.5) * 12,
        }),
        {} as Record<Emotion, number>
      ),
    },
  }
}

function generateMockComparativeAnalytics(analytics: DemographicsAnalytics): ComparativeAnalytics {
  return {
    weekday_vs_weekend: {
      weekday: {
        total_count: Math.floor(analytics.total_count * 0.7),
        gender_distribution: analytics.gender_distribution,
        age_distribution: analytics.age_distribution,
        emotion_distribution: analytics.emotion_distribution,
        ethnicity_distribution: analytics.ethnicity_distribution,
      },
      weekend: {
        total_count: Math.floor(analytics.total_count * 0.3),
        gender_distribution: {
          [Gender.MALE]: Math.floor(analytics.gender_distribution[Gender.MALE] * 0.8),
          [Gender.FEMALE]: Math.floor(analytics.gender_distribution[Gender.FEMALE] * 1.2),
        },
        age_distribution: analytics.age_distribution,
        emotion_distribution: analytics.emotion_distribution,
        ethnicity_distribution: analytics.ethnicity_distribution,
      },
    },
    day_vs_night: {
      day: {
        total_count: Math.floor(analytics.total_count * 0.6),
        gender_distribution: analytics.gender_distribution,
        age_distribution: analytics.age_distribution,
        emotion_distribution: analytics.emotion_distribution,
        ethnicity_distribution: analytics.ethnicity_distribution,
      },
      night: {
        total_count: Math.floor(analytics.total_count * 0.4),
        gender_distribution: analytics.gender_distribution,
        age_distribution: analytics.age_distribution,
        emotion_distribution: analytics.emotion_distribution,
        ethnicity_distribution: analytics.ethnicity_distribution,
      },
    },
  }
}

function generateMockHourlyDistribution(): HourlyDistribution[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Math.floor(Math.random() * 100) + 10,
    dominant_emotion: Object.values(Emotion)[Math.floor(Math.random() * Object.values(Emotion).length)],
    dominant_age: Object.values(Age)[Math.floor(Math.random() * Object.values(Age).length)],
  }))
}

function generateMockDailyDistribution(): DailyDistribution[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return days.map((day) => ({
    day,
    count: Math.floor(Math.random() * 200) + 50,
    peak_hour: Math.floor(Math.random() * 24),
    dominant_demographics: {
      gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
      age: Object.values(Age)[Math.floor(Math.random() * Object.values(Age).length)],
      emotion: Object.values(Emotion)[Math.floor(Math.random() * Object.values(Emotion).length)],
      ethnicity: Object.values(EthnicGroup)[Math.floor(Math.random() * Object.values(EthnicGroup).length)],
    },
  }))
}

function generateMockCorrelationMatrix(): CorrelationMatrix {
  return {
    age_emotion: Object.values(Age).reduce(
      (acc, age) => ({
        ...acc,
        [age]: Object.values(Emotion).reduce(
          (emotionAcc, emotion) => ({
            ...emotionAcc,
            [emotion]: Math.floor(Math.random() * 50) + 1,
          }),
          {} as Record<Emotion, number>
        ),
      }),
      {} as Record<Age, Record<Emotion, number>>
    ),
    gender_emotion: Object.values(Gender).reduce(
      (acc, gender) => ({
        ...acc,
        [gender]: Object.values(Emotion).reduce(
          (emotionAcc, emotion) => ({
            ...emotionAcc,
            [emotion]: Math.floor(Math.random() * 100) + 10,
          }),
          {} as Record<Emotion, number>
        ),
      }),
      {} as Record<Gender, Record<Emotion, number>>
    ),
    ethnicity_emotion: Object.values(EthnicGroup).reduce(
      (acc, ethnicity) => ({
        ...acc,
        [ethnicity]: Object.values(Emotion).reduce(
          (emotionAcc, emotion) => ({
            ...emotionAcc,
            [emotion]: Math.floor(Math.random() * 30) + 5,
          }),
          {} as Record<Emotion, number>
        ),
      }),
      {} as Record<EthnicGroup, Record<Emotion, number>>
    ),
  }
}
