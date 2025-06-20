import { 
  Camera, 
  Tag, 
  DemographicsConfig, 
  DemographicsResult, 
  DemographicsAnalytics,
  PaginatedResponse,
  CameraFormData,
  DemographicsConfigFormData,
  DemographicsFilters
} from '@/types';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Tags API
export const tagsApi = {
  getAll: (): Promise<Tag[]> => 
    apiRequest<Tag[]>('/tags/'),
};

// Cameras API
export const camerasApi = {
  getList: (params: {
    page?: number;
    size?: number;
    camera_name?: string;
  } = {}): Promise<PaginatedResponse<Camera>> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.size) searchParams.append('size', params.size.toString());
    if (params.camera_name) searchParams.append('camera_name', params.camera_name);
    
    const queryString = searchParams.toString();
    const endpoint = `/cameras/${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<PaginatedResponse<Camera>>(endpoint);
  },

  getById: (id: string): Promise<Camera> => 
    apiRequest<Camera>(`/cameras/${id}`),

  update: (id: string, data: CameraFormData): Promise<Camera> => 
    apiRequest<Camera>(`/cameras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Demographics API
export const demographicsApi = {
  createConfig: (data: DemographicsConfigFormData & { camera_id: string }): Promise<DemographicsConfig> => 
    apiRequest<DemographicsConfig>('/demographics/config', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateConfig: (configId: string, data: DemographicsConfigFormData): Promise<DemographicsConfig> => 
    apiRequest<DemographicsConfig>(`/demographics/config/${configId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getResults: (filters: DemographicsFilters): Promise<{
    results: DemographicsResult[];
    analytics: DemographicsAnalytics;
  }> => {
    const searchParams = new URLSearchParams();
    searchParams.append('camera_id', filters.camera_id);
    
    if (filters.gender) searchParams.append('gender', filters.gender);
    if (filters.age) searchParams.append('age', filters.age);
    if (filters.emotion) searchParams.append('emotion', filters.emotion);
    if (filters.ethnicity) searchParams.append('ethnicity', filters.ethnicity);
    if (filters.start_date) searchParams.append('start_date', filters.start_date);
    if (filters.end_date) searchParams.append('end_date', filters.end_date);
    
    return apiRequest<{
      results: DemographicsResult[];
      analytics: DemographicsAnalytics;
    }>(`/demographics/results?${searchParams.toString()}`);
  },
}; 