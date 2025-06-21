// services/cameras.ts

import API from "./instance";

export const getCameras = async (page = 1, size = 10, search = "") => {
  const res = await API.get("/cameras", {
    params: {
      page,
      size,
      camera_name: search || undefined,
    },
  });
  return res.data;
};

export const getCameraDetails = async (cameraId: string) => {
  const res = await API.get(`/cameras/${cameraId}`);
  return res.data;
};

export const updateCamera = async (cameraId: string, payload: unknown) => {
  const res = await API.put(`/cameras/${cameraId}`, payload);
  return res.data;
};
