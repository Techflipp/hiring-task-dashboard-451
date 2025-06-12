'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Camera, CameraFilters } from '../lib/types';

export function useCameras(filters: CameraFilters = {}) {
  return useQuery({
    queryKey: ['cameras', filters],
    queryFn: () => apiClient.getCameras(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: ['camera', id],
    queryFn: () => apiClient.getCamera(id),
    enabled: !!id,
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Camera> }) =>
      apiClient.updateCamera(id, data),
    onSuccess: (updatedCamera) => {
      // Update the specific camera in cache
      queryClient.setQueryData(['camera', updatedCamera.id], updatedCamera);
      
      // Invalidate cameras list to refresh
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
}