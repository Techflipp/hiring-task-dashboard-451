import { apiClient } from './client';
import { Camera, PaginatedResponse } from '../types';

export interface CameraListParams {
  page?: number;
  size?: number;
  camera_name?: string;
}

export interface UpdateCameraData {
  name: string;
  rtsp_url: string;
  stream_frame_width?: number;
  stream_frame_height?: number;
  stream_max_length?: number;
  stream_quality?: number;
  stream_fps?: number;
  stream_skip_frames?: number;
  tags?: string[];
}

export const camerasApi = {
  list: async (params: CameraListParams = {}): Promise<PaginatedResponse<Camera>> => {
    const { data } = await apiClient.get('/cameras/', { params });
    return data;
  },

  getById: async (id: string): Promise<Camera> => {
    const { data } = await apiClient.get(`/cameras/${id}`);
    return data;
  },

  update: async (id: string, updateData: UpdateCameraData): Promise<Camera> => {
    const { data } = await apiClient.put(`/cameras/${id}`, updateData);
    return data;
  },
};