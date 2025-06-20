import { apiClient } from "@/lib/apiClient";
import { CameraTag } from "@/types/camera.interface";
import { useQuery } from "@tanstack/react-query";

export const useTags = () => {
  return useQuery<CameraTag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await apiClient.get("/tags/");
      return response.data;
    },
  });
};