import { Camera, CameraFilters, DemographicsConfig, DemographicsFilters, DemographicsResult, PaginatedResponse, Tag } from "./types";

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Camera endpoints
  async getCameras(filters: CameraFilters = {}): Promise<PaginatedResponse<Camera>> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.camera_name) params.append('camera_name', filters.camera_name);

    return this.request<PaginatedResponse<Camera>>(`/cameras/?${params}`);
  }

  async getCamera(id: string): Promise<Camera> {
    return this.request<Camera>(`/cameras/${id}`);
  }

  async updateCamera(id: string, data: Partial<Camera>): Promise<Camera> {
    return this.request<Camera>(`/cameras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Tags endpoints
  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags/');
  }

  // Demographics endpoints
  async createDemographicsConfig(data: Omit<DemographicsConfig, 'id'>): Promise<DemographicsConfig> {
    return this.request<DemographicsConfig>('/demographics/config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDemographicsConfig(id: string, data: Partial<DemographicsConfig>): Promise<DemographicsConfig> {
    return this.request<DemographicsConfig>(`/demographics/config/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getDemographicsResults(filters: DemographicsFilters): Promise<DemographicsResult[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.request<DemographicsResult[]>(`/demographics/results?${params}`);
  }
}

export const apiClient = new ApiClient();