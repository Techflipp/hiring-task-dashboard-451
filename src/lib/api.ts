import type {
  Camera,
  CameraListResponse,
  Tag,
  DemographicsConfig,
  DemographicsResult,
  UpdateCameraData,
  CreateDemographicsConfigData,
  UpdateDemographicsConfigData,
} from "./types"

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Tags API
export const tagsApi = {
  getAll: (): Promise<Tag[]> => fetchApi("/tags/"),
}

// Cameras API
export const camerasApi = {
  getList: (
    params: {
      page?: number
      size?: number
      camera_name?: string
    } = {},
  ): Promise<CameraListResponse> => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.size) searchParams.set("size", params.size.toString())
    if (params.camera_name) searchParams.set("camera_name", params.camera_name)

    return fetchApi(`/cameras/?${searchParams.toString()}`)
  },

  getById: (id: string): Promise<Camera> => fetchApi(`/cameras/${id}`),

  update: (id: string, data: UpdateCameraData): Promise<Camera> =>
    fetchApi(`/cameras/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Demographics API
export const demographicsApi = {
  createConfig: (data: CreateDemographicsConfigData): Promise<DemographicsConfig> =>
    fetchApi("/demographics/config", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateConfig: (id: string, data: UpdateDemographicsConfigData): Promise<DemographicsConfig> =>
    fetchApi(`/demographics/config/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getResults: (params: {
    camera_id: string
    gender?: string
    age?: string
    emotion?: string
    ethnicity?: string
    start_date?: string
    end_date?: string
  }): Promise<DemographicsResult[]> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })

    return fetchApi(`/demographics/results?${searchParams.toString()}`)
  },
}
