import { API_BASE_URL } from './constants'
import type {
  Camera,
  CameraListResponse,
  DemographicsConfig,
  DemographicsFilters,
  DemographicsResultsResponse,
  Tag,
} from './types'

/**
 * Makes an API request to the specified endpoint.
 * @template T - The expected response type.
 * @param {string} endpoint - The API endpoint to call.
 * @param {RequestInit} [options={}] - Optional fetch options.
 * @returns {Promise<T | null>} The response data or null if the request failed.
 */
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T | null> => {
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
    // Format the error details properly
    if (error.detail && Array.isArray(error.detail)) {
      const errorMessages = error.detail.map((err: unknown) => {
        if (typeof err === 'object' && err !== null) {
          return Object.entries(err)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
        }
        return String(err)
      })
      throw new Error(errorMessages.join('\n'))
    }
    throw new Error(error.detail || 'Failed to update camera')
  }

  return response.json()
}

/**
 * Fetches a paginated list of cameras, optionally filtered by camera name.
 * @param {number} [page=1] - The page number.
 * @param {number} [size=20] - The number of items per page.
 * @param {string} [cameraName] - Optional camera name filter.
 * @returns {Promise<CameraListResponse | null>} The camera list response or null.
 */
export const getCameras = async (page = 1, size = 20, cameraName?: string): Promise<CameraListResponse | null> => {
  let endpoint = `/cameras/?page=${page}&size=${size}`
  if (cameraName) {
    endpoint += `&camera_name=${encodeURIComponent(cameraName)}`
  }
  return apiRequest<CameraListResponse | null>(endpoint)
}

/**
 * Fetches a single camera by its ID.
 * @param {string} id - The camera ID.
 * @returns {Promise<Camera | null>} The camera object or null.
 */
export const getCamera = async (id: string): Promise<Camera | null> => {
  return apiRequest<Camera | null>(`/cameras/${id}`)
}

/**
 * Updates a camera by its ID.
 * @param {string} id - The camera ID.
 * @param {Partial<Omit<Camera, 'tags'>> & { tags?: string[] }} data - The camera data to update.
 * @returns {Promise<Camera | null>} The updated camera object or null.
 */
export const updateCamera = async (
  id: string,
  data: Partial<Omit<Camera, 'tags'>> & { tags?: string[] }
): Promise<Camera | null> => {
  console.log('Updating camera', id, data)
  return apiRequest<Camera | null>(`/cameras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Fetches all tags.
 * @returns {Promise<Tag[] | null>} The list of tags or null.
 */
export const getTags = async (): Promise<Tag[] | null> => {
  return apiRequest<Tag[] | null>('/tags/')
}

/**
 * Creates a new demographics configuration for a camera.
 * @param {Partial<DemographicsConfig> & { camera_id: string }} data - The demographics config data.
 * @returns {Promise<DemographicsConfig | null>} The created demographics config or null.
 */
export const createDemographicsConfig = async (
  data: Partial<DemographicsConfig> & { camera_id: string }
): Promise<DemographicsConfig | null> => {
  return apiRequest<DemographicsConfig | null>('/demographics/config', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Updates an existing demographics configuration by its ID.
 * @param {string} id - The demographics config ID.
 * @param {Partial<DemographicsConfig>} data - The demographics config data to update.
 * @returns {Promise<DemographicsConfig | null>} The updated demographics config or null.
 */
export const updateDemographicsConfig = async (
  id: string,
  data: Partial<DemographicsConfig>
): Promise<DemographicsConfig | null> => {
  return apiRequest<DemographicsConfig | null>(`/demographics/config/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Fetches demographics results based on provided filters.
 * @param {DemographicsFilters} filters - The filters to apply.
 * @returns {Promise<DemographicsResultsResponse | null>} The demographics results or null.
 */
export const getDemographicsResults = async (
  filters: DemographicsFilters
): Promise<DemographicsResultsResponse | null> => {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  }

  return apiRequest<DemographicsResultsResponse | null>(`/demographics/results?${queryParams.toString()}`)
}
