import api from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

import {
  TagsResponse,
  getCameraResponse,
  updateCameraResponse,
  updateCameraRequest,
  getCameraByIdResponse,
} from "@/constants/apitypes";

export const getTags = async (): Promise<TagsResponse> => {
  const response = await api.post(ENDPOINTS.getTags);
  return response.data;
};

export const getCameras = async (
  camera_name: string | null,
  page: number | null,
  size: number | null
): Promise<getCameraResponse> => {
  const response = await api.get(ENDPOINTS.getCameras, {
    params: { camera_name, page, size },
  });
  return response.data;
};

export const getCameraById = async (
  id: string
): Promise<getCameraByIdResponse> => {
  const response = await api.get(ENDPOINTS.getCamera(id));
  return response.data;
};

export const updateCamera = async (
  id: string,
  data: updateCameraRequest
): Promise<updateCameraResponse> => {
  const response = await api.post(ENDPOINTS.updateCamera(id), data);
  return response.data;
};
