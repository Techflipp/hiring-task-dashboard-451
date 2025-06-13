import { apiClient } from './client';
import { DemographicsConfig, DemographicsResultsResponse } from '../types';

export interface CreateDemographicsConfigData {
  camera_id: string;
  track_history_max_length?: number;
  exit_threshold?: number;
  min_track_duration?: number;
  detection_confidence_threshold?: number;
  demographics_confidence_threshold?: number;
  min_track_updates?: number;
  box_area_threshold?: number;
  save_interval?: number;
  frame_skip_interval?: number;
}

export type UpdateDemographicsConfigData = Omit<CreateDemographicsConfigData, 'camera_id'>;

export interface DemographicsResultsParams {
  camera_id: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
}

export const demographicsApi = {
  createConfig: async (data: CreateDemographicsConfigData): Promise<DemographicsConfig> => {
    const response = await apiClient.post('/demographics/config', data);
    return response.data;
  },

  updateConfig: async (configId: string, data: UpdateDemographicsConfigData): Promise<DemographicsConfig> => {
    const response = await apiClient.put(`/demographics/config/${configId}`, data);
    return response.data;
  },

  getResults: async (params: DemographicsResultsParams): Promise<DemographicsResultsResponse> => {
    // Filter out empty string parameters
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const response = await apiClient.get('/demographics/results', { params: cleanParams });
    return response.data;
  },
};