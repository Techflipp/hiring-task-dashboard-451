import type { DemographicsConfig, DemographicsResponse } from "@/lib/types"

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

interface CreateDemographicsConfigParams {
  camera_id: string
  track_history_max_length?: number
  exit_threshold?: number
  min_track_duration?: number
  detection_confidence_threshold?: number
  demographics_confidence_threshold?: number
  min_track_updates?: number
  box_area_threshold?: number
  save_interval?: number
  frame_skip_interval?: number
}

export async function createDemographicsConfig(params: CreateDemographicsConfigParams): Promise<DemographicsConfig> {
  const response = await fetch(`${API_BASE_URL}/demographics/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`Failed to create demographics config: ${response.status}`)
  }

  return response.json()
}

export async function updateDemographicsConfig(id: string, data: any): Promise<DemographicsConfig> {
  const response = await fetch(`${API_BASE_URL}/demographics/config/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update demographics config: ${response.status}`)
  }

  return response.json()
}

interface GetDemographicsResultsParams {
  camera_id: string
  gender?: string
  age?: string
  emotion?: string
  ethnicity?: string
  start_date?: string
  end_date?: string
}

export async function getDemographicsResults(params: GetDemographicsResultsParams): Promise<DemographicsResponse> {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`${API_BASE_URL}/demographics/results?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch demographics results: ${response.status}`)
  }

  return response.json()
}
