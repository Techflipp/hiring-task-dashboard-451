// lib/react-query/getCamerasQuery.ts

import {
  editCameraDetails,
  getCameraById,
  getCamerasList,
} from '@/server/actions/cameras/cameras.actions';
import {
  EditCameraDetailsInput,
  GetCameraByIdInput,
  GetCamerasListInput,
} from '@/server/actions/cameras/cameras.inputs';

// Get all cameras
export const camerasQueryKey = (params?: GetCamerasListInput) => ['cameras', params];

export const camerasQueryFn = async (params: GetCamerasListInput) => {
  return await getCamerasList(params);
};

// Get a camera details
export const cameraQueryKey = (params: GetCameraByIdInput) => ['camera', params];

export const cameraQueryFn = async (params: GetCameraByIdInput) => {
  return await getCameraById(params);
};

// Edit camera details
export const editCameraDetailsMutationFn = async (
  camera_id: string,
  params: EditCameraDetailsInput,
) => {
  return await editCameraDetails(camera_id, params);
};
