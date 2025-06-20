export interface DemographicItem {
  id: string
  config_id: string
  created_at: string
  count: number
  gender: string
  age: string
  emotion: string
  ethnicity: string
}

export interface AnalyticsDistributions {
  gender_distribution: Record<string, number>
  age_distribution: Record<string, number>
  emotion_distribution: Record<string, number>
  ethnicity_distribution: Record<string, number>
  total_count: number
}

export interface AnalyticsResponse {
  items: DemographicItem[]
  analytics: AnalyticsDistributions
}
