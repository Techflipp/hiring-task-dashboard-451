import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasApi, tagsApi, demographicsApi } from '@/lib/api';
import { CameraFormData, DemographicsConfigFormData, DemographicsFilters } from '@/types';

// Tags hooks
export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });
};

// Cameras hooks
export const useCameras = (params: {
  page?: number;
  size?: number;
  camera_name?: string;
} = {}) => {
  return useQuery({
    queryKey: ['cameras', params],
    queryFn: () => camerasApi.getList(params),
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
    mutationFn: ({ id, data }: { id: string; data: CameraFormData }) =>
      camerasApi.update(id, data),
    onSuccess: (updatedCamera) => {
      // Invalidate and refetch cameras list
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      // Update the specific camera in cache
      queryClient.setQueryData(['camera', updatedCamera.id], updatedCamera);
    },
  });
};

// Demographics hooks
export const useCreateDemographicsConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DemographicsConfigFormData & { camera_id: string }) =>
      demographicsApi.createConfig(data),
    onSuccess: (config) => {
      // Invalidate camera data to refetch with new config
      queryClient.invalidateQueries({ queryKey: ['camera', config.camera_id] });
    },
  });
};

export const useUpdateDemographicsConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ configId, data }: { configId: string; data: DemographicsConfigFormData }) =>
      demographicsApi.updateConfig(configId, data),
    onSuccess: (config) => {
      // Invalidate camera data to refetch with updated config
      queryClient.invalidateQueries({ queryKey: ['camera', config.camera_id] });
    },
  });
};

export const useDemographicsResults = (filters: DemographicsFilters) => {
  return useQuery({
    queryKey: ['demographics-results', filters],
    queryFn: () => demographicsApi.getResults(filters),
    enabled: !!filters.camera_id,
  });
}; 