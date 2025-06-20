import { apiClient } from "@/lib/apiClient";
import { Camera } from "@/types/camera.interface";
import { useQuery, UseQueryResult } from "@tanstack/react-query";


export const useCameraDetail = (id: string): UseQueryResult<Camera,Error> => {
  return useQuery({
    queryKey: ["camera", id],
    queryFn: () => apiClient.get(`/cameras/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};