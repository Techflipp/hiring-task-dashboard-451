import { apiClient } from "@/lib/apiClient";
import { Camera } from "@/types/camera.interface";
import { useQuery } from "@tanstack/react-query";


export const useCameraDetail = (id: string) => {
  return useQuery<Camera>({
    queryKey: ["camera", id],
    queryFn: () => apiClient.get(`/cameras/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};