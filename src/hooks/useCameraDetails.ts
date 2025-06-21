import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useCameraDetails(cameraId: string | number, options = {}) {
  return useQuery({
    queryKey: ["camera", cameraId],
    queryFn: async () => {
      const { data } = await api.get(`/cameras/${cameraId}`);
      return data;
    },
    enabled: !!cameraId,
    ...options,
  });
}
