import axios from 'axios';
import type {
  Camera,
  Tag,
  DemographicsConfig,
  DemographicsResult,
  PaginatedResponse,
  CameraUpdatePayload,
  DemographicsConfigPayload,
} from '@/types/api';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

const api = {
  getCameras: async (page: number, size: number, search?: string): Promise<PaginatedResponse<Camera>> => {
    const response = await axios.get(`${API_BASE_URL}/cameras?page=${page}&size=${size}&search=${search || ''}`);
    return response.data;
  },

  getCamera: async (id: string): Promise<Camera> => {
    const response = await axios.get(`${API_BASE_URL}/cameras/${id}`);
    return response.data;
  },

  updateCamera: async (id: string, data: { name: string; rtsp_url: string }): Promise<Camera> => {
    const response = await axios.put(`${API_BASE_URL}/cameras/${id}`, data);
    return response.data;
  },

  createDemographicsConfig: async (data: { camera_id: string; gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean }): Promise<DemographicsConfig> => {
    const response = await axios.post(`${API_BASE_URL}/demographics-config`, data);
    return response.data;
  },

  updateDemographicsConfig: async (id: string, data: { gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean }): Promise<DemographicsConfig> => {
    const response = await axios.put(`${API_BASE_URL}/demographics-config/${id}`, data);
    return response.data;
  },

  getDemographicsResults: async (
    cameraId: string,
    filters?: {
      gender?: string;
      age?: string;
      emotion?: string;
      ethnicity?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<DemographicsResult[]> => {
    try {
      console.log('Fetching demographics results for camera:', cameraId);
      console.log('Filters:', filters);
      
      // Remove empty filter values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(([_, value]) => value !== '')
      );
      
      console.log('Clean filters:', cleanFilters);
      
      const { data } = await axios.get(`${API_BASE_URL}/demographics/results`, {
        params: { 
          camera_id: cameraId,
          ...cleanFilters 
        },
      });
      
      console.log('API Response:', data);
      
      // Handle both array and object response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        // If the response is an object with a results property
        if ('results' in data && Array.isArray(data.results)) {
          return data.results;
        }
        // If the response is an object with items property (paginated response)
        if ('items' in data && Array.isArray(data.items)) {
          return data.items;
        }
        // If the response is an object with data property
        if ('data' in data && Array.isArray(data.data)) {
          return data.data;
        }
      }
      
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from API');
    } catch (error) {
      console.error('Error fetching demographics results:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
          }
        });
        
        if (error.response?.status === 404) {
          throw new Error('No demographics data found for this camera');
        }
        
        if (error.response?.status === 400) {
          throw new Error('Invalid request parameters');
        }
        
        throw new Error(error.response?.data?.message || 'Failed to fetch demographics results');
      }
      
      throw error;
    }
  },

  getTags: async (): Promise<Tag[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/tags/`);
    return data;
  },
};

export { api }; 