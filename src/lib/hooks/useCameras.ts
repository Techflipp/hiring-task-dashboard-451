import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasApi, CameraListParams, UpdateCameraData } from '../api/cameras';

export const useCameras = (params: CameraListParams = {}) => {
  return useQuery({
    queryKey: ['cameras', params],
    queryFn: () => camerasApi.list(params),
    retry: 1,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCamera = (id: string) => {
  return useQuery({
    queryKey: ['camera', id],
    queryFn: () => camerasApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCameraData }) =>
      camerasApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      queryClient.invalidateQueries({ queryKey: ['camera', data.id] });
    },
  });
};