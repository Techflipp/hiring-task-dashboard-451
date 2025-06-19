import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Camera, PaginatedResponse, CameraTag } from "@/types/camera.interface";
import { CameraFormValues } from "@/lib/validators/cameraSchema";
import { DemographicsFormValues } from "@/lib/validators/demographicsSchema";

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

export const useCameraDetail = (id: string) => {
  return useQuery({
    queryKey: ["camera", id],
    queryFn: () => apiClient.get(`/cameras/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

export const useUpdateCamera = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CameraFormValues) =>
      apiClient.put(`/cameras/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", id] });
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
  });
};
export const useUpsertDemographicsConfig = (cameraId: string, configId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DemographicsFormValues) => {
      if (configId) {
        return apiClient.put(`/demographics/config/${configId}`, data).then((res) => res.data)
      } else {
        return apiClient
          .post(`/demographics/config`, { ...data, camera_id: cameraId })
          .then((res) => res.data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] })
    },
  })
}

export const useTags = () => {
  return useQuery<CameraTag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await apiClient.get("/tags/");
      return response.data;
    },
  });
};
