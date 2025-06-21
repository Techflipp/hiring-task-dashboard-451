"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Camera } from "@/types/camera";

export const useCameraDetail = (cameraId: string) => {
  return useQuery<Camera>({
    queryKey: ['camera', cameraId],
    queryFn: async () => {
      const res = await api.get(`/cameras/${cameraId}`);
      return res.data;
    },
    enabled: !!cameraId,
  });
};
