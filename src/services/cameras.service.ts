import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import {
  Camera,
  CameraListParams,
  CameraUpdatePayload,
  PaginatedResponse,
} from "@/types";

export const camerasService = {
  async getCameras(
    params?: CameraListParams
  ): Promise<PaginatedResponse<Camera>> {
    return apiClient.get<PaginatedResponse<Camera>>(
      API_ENDPOINTS.cameras,
      params
    );
  },

  async getCameraById(id: string): Promise<Camera> {
    return apiClient.get<Camera>(`${API_ENDPOINTS.cameras}${id}`);
  },

  async updateCamera(id: string, data: CameraUpdatePayload): Promise<Camera> {
    return apiClient.put<Camera>(`${API_ENDPOINTS.cameras}${id}`, data);
  },
};
