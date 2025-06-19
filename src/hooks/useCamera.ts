import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Camera, PaginatedResponse, CameraTag } from '@/types/camera.interface';

interface Params {
    page?: number;
    size?: number;
    camera_name?: string
}
export const useCameras = ({page=1, size=10, camera_name=''}:Params) => {
  return useQuery<PaginatedResponse<Camera>>({
    queryKey: ['cameras', page, size, camera_name],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Camera>>('/cameras/', {
        params: { page, size, camera_name },
      });
      return response.data;
    },
    placeholderData: (prevData)=> prevData
  });
};

export const useCamera = (id: string) => {
  return useQuery<Camera>({
    queryKey: ['camera', id],
    queryFn: async () => {
      const response = await apiClient.get(`/cameras/${id}`);
      return response.data;
    },
  });
};


export const useTags = () => {
  return useQuery<CameraTag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await apiClient.get('/tags/');
      return response.data;
    },
  });
};