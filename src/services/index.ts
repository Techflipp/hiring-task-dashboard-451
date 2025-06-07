import api from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

import {
  TagsResponse,
  getCamerasResponse,
  updateCameraResponse,
  updateCameraRequest,
  getCameraByIdResponse,
  updateDemoGraphicsRequest,
  updateDemoGraphicsResponse,
  getDemoGraphicsResultsParams,
  getDemoGraphicsResultsResponse,
} from "@/constants/apitypes";

export const getTags = async (): Promise<TagsResponse> => {
  const response = await api.get(ENDPOINTS.getTags);
  return response.data;
};

export const getCameras = async (
  camera_name: string | null,
  page: number | null,
  size: number | null
): Promise<getCamerasResponse> => {
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
  const response = await api.put(ENDPOINTS.updateCamera(id), data);
  return response.data;
};

export const updateDemoGraphics = async (
  id: string,
  data: updateDemoGraphicsRequest
): Promise<updateDemoGraphicsResponse> => {
  const response = await api.put(ENDPOINTS.updateDemographics(id), data);
  return response.data;
};

export const getDemographicsResults = async (
  params: getDemoGraphicsResultsParams
): Promise<getDemoGraphicsResultsResponse> => {
  const response = await api.get(ENDPOINTS.getDemographicsResult, { params });
  return response.data;
};
