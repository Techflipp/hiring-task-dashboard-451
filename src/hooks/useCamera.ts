import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Camera, PaginatedResponse } from "@/types/camera.interface";

interface Params {
  page?: number;
  size?: number;
  camera_name?: string;
}
export const useCameras = ({
  page = 1,
  size = 10,
  camera_name = "",
}: Params) => {
  return useQuery<PaginatedResponse<Camera>>({
    queryKey: ["cameras", page, size, camera_name],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Camera>>(
        "/cameras/",
        {
          params: { page, size, camera_name },
        }
      );
      return response.data;
    },
    placeholderData: (prevData) => prevData,
  });
};
