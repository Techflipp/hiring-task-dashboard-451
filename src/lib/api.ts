import { API_BASE_URL } from './constants'
import type {
  Camera,
  CameraListResponse,
  DemographicsConfig,
  DemographicsFilters,
  DemographicsResultsResponse,
  Tag,
  CreateDemographicsConfigValues,
  UpdateDemographicsConfigValues,
} from './types'
import { CameraSchema, CameraListResponseSchema, DemographicsConfigSchema, TagSchema } from '@/schemas/camera.schema'
import { ApiErrorSchema, DemographicsResultsResponseSchema } from '@/schemas/api.schema'
import { z } from 'zod'
import { UpdateCameraValues } from '@/schemas/cameraForm.schema'

/**
 * Makes an API request with validation
 */
const apiRequest = async <T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> => {
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
  const result = schema.parse(data) // This will throw if validation fails
  return result
}

/**
 * Fetches a paginated list of cameras with validation
 */
export const getCameras = async (page = 1, size = 20, cameraName?: string): Promise<CameraListResponse> => {
  let endpoint = `/cameras/?page=${page}&size=${size}`
  if (cameraName) {
    endpoint += `&camera_name=${encodeURIComponent(cameraName)}`
  }
  return apiRequest(endpoint, CameraListResponseSchema)
}

/**
 * Fetches a single camera with validation
 */
export const getCamera = async (id: string): Promise<Camera> => {
  return apiRequest(`/cameras/${id}`, CameraSchema)
}

/**
 * Updates a camera with validation
 */
export const updateCamera = async (id: string, data: UpdateCameraValues): Promise<Camera> => {
  return apiRequest(`/cameras/${id}`, CameraSchema, {
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
  return apiRequest('/demographics/config', DemographicsConfigSchema, {
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
  return apiRequest(`/demographics/config/${id}`, DemographicsConfigSchema, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Fetches demographics results with validation
 */
export const getDemographicsResults = async (filters: DemographicsFilters): Promise<DemographicsResultsResponse> => {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  }

  return apiRequest(`/demographics/results?${queryParams.toString()}`, DemographicsResultsResponseSchema)
}
