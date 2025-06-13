import { API_BASE_URL } from './constants'
import type {
  Camera,
  CameraListResponse,
  DemographicsConfig,
  DemographicsFilters,
  DemographicsResultsResponse,
  Tag,
} from './types'

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
    throw new Error(error.detail || `API request failed with status ${response.status}`)
  }

  return response.json()
}

// Camera API functions
export const getCameras = async (page = 1, size = 20, cameraName?: string): Promise<CameraListResponse> => {
  let endpoint = `/cameras/?page=${page}&size=${size}`
  if (cameraName) {
    endpoint += `&camera_name=${encodeURIComponent(cameraName)}`
  }
  return apiRequest<CameraListResponse>(endpoint)
}

export const getCamera = async (id: string): Promise<Camera> => {
  return apiRequest<Camera>(`/cameras/${id}`)
}

export const updateCamera = async (id: string, data: Partial<Camera>): Promise<Camera> => {
  return apiRequest<Camera>(`/cameras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Tag API functions
export const getTags = async (): Promise<Tag[]> => {
  return apiRequest<Tag[]>('/tags/')
}

// Demographics API functions
export const createDemographicsConfig = async (
  data: Partial<DemographicsConfig> & { camera_id: string }
): Promise<DemographicsConfig> => {
  return apiRequest<DemographicsConfig>('/demographics/config', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const updateDemographicsConfig = async (
  id: string,
  data: Partial<DemographicsConfig>
): Promise<DemographicsConfig> => {
  return apiRequest<DemographicsConfig>(`/demographics/config/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const getDemographicsResults = async (filters: DemographicsFilters): Promise<DemographicsResultsResponse> => {
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString())
    }
  })

  return apiRequest<DemographicsResultsResponse>(`/demographics/results?${queryParams.toString()}`)
}
