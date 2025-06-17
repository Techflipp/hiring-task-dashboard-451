import axios from 'axios';
import { PaginatedCameras, Camera, DemographicsConfig, Tag, DemographicsFilters, DemographicsResponse } from '@/types';

const apiClient = axios.create({
  baseURL: 'https://task-451-api.ryd.wafaicloud.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCameras = async (page = 1, size = 10, camera_name = ''): Promise<PaginatedCameras> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (camera_name) {
    params.append('camera_name', camera_name);
  }
  const response = await apiClient.get(`/cameras/?${params.toString()}`);
  return response.data;
};

export const getCameraDetails = async (cameraId: string): Promise<Camera> => {
    const response = await apiClient.get(`/cameras/${cameraId}`);
    return response.data;
}

export const updateCamera = async (cameraId: string, data: Partial<Camera>): Promise<Camera> => {
    const response = await apiClient.put(`/cameras/${cameraId}`, data);
    return response.data;
}

export const createDemographicsConfig = async (data: Partial<DemographicsConfig>): Promise<DemographicsConfig> => {
    const response = await apiClient.post('/demographics/config', data);
    return response.data;
}

export const updateDemographicsConfig = async (configId: string, data: Partial<DemographicsConfig>): Promise<DemographicsConfig> => {
    const response = await apiClient.put(`/demographics/config/${configId}`, data);
    return response.data;
}

export const getTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get('/tags/');
    return response.data;
}

export const getDemographicsResults = async (filters: DemographicsFilters): Promise<DemographicsResponse> => {
    console.log('Fetching demographics with filters:', filters);
    const params = new URLSearchParams();
    for (const key in filters) {
        if (filters[key as keyof DemographicsFilters]) {
            params.append(key, filters[key as keyof DemographicsFilters] as string);
        }
    }
    const url = `/demographics/results?${params.toString()}`;
    console.log('API URL:', url);
    try {
        const response = await apiClient.get(url);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};