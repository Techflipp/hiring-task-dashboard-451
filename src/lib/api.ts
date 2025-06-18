import {
  Camera,
  CameraDetail,
  Tag,
  PaginatedResponse,
  CameraListParams,
  UpdateCameraData,
  DemographicsConfig,
  CreateDemographicsConfigData,
  UpdateDemographicsConfigData,
  DemographicsResultsResponse,
  DemographicsResultsParams
} from '@/types/api';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new ApiError(errorData.detail || `HTTP ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0);
    }
  }

  // Tags endpoints
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags/');
  }

  // Camera endpoints
  async getCameras(params?: CameraListParams): Promise<PaginatedResponse<Camera>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.size) searchParams.append('size', params.size.toString());
    if (params?.camera_name) searchParams.append('camera_name', params.camera_name);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/cameras/?${queryString}` : '/cameras/';
    
    return this.request<PaginatedResponse<Camera>>(endpoint);
  }

  async getCamera(cameraId: string): Promise<CameraDetail> {
    return this.request<CameraDetail>(`/cameras/${cameraId}`);
  }

  async updateCamera(cameraId: string, data: UpdateCameraData): Promise<CameraDetail> {
    return this.request<CameraDetail>(`/cameras/${cameraId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Demographics endpoints
  async createDemographicsConfig(data: CreateDemographicsConfigData): Promise<DemographicsConfig> {
    return this.request<DemographicsConfig>('/demographics/config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDemographicsConfig(configId: string, data: UpdateDemographicsConfigData): Promise<DemographicsConfig> {
    return this.request<DemographicsConfig>(`/demographics/config/${configId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDemographicsConfig(configId: string): Promise<void> {
    return this.request<void>(`/demographics/config/${configId}`, {
      method: 'DELETE',
    });
  }

  async getDemographicsResults(params: DemographicsResultsParams): Promise<DemographicsResultsResponse> {
    const searchParams = new URLSearchParams();
    
    searchParams.append('camera_id', params.camera_id);
    if (params.gender) searchParams.append('gender', params.gender);
    if (params.age) searchParams.append('age', params.age);
    if (params.emotion) searchParams.append('emotion', params.emotion);
    if (params.ethnicity) searchParams.append('ethnicity', params.ethnicity);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    const endpoint = `/demographics/results?${queryString}`;
    
    return this.request<DemographicsResultsResponse>(endpoint);
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient(); 