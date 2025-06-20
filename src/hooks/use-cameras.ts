import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Camera, DemographicsConfig } from '@/types/api';

export function useCameras(page: number, size: number, search?: string) {
  return useQuery({
    queryKey: ['cameras', page, size, search],
    queryFn: () => api.getCameras(page, size, search),
  });
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: ['camera', id],
    queryFn: () => api.getCamera(id),
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; rtsp_url: string }) => api.updateCamera(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
}

export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { camera_id: string; gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean }) => api.createDemographicsConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera'] });
    },
  });
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean }) => api.updateDemographicsConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera'] });
    },
  });
} 