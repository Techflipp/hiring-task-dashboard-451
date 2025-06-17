import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import {
  CameraListParams,
  UpdateCameraData,
  CreateDemographicsConfigData,
  UpdateDemographicsConfigData,
  DemographicsResultsParams
} from '@/types/api';

// Query Keys
export const queryKeys = {
  tags: ['tags'] as const,
  cameras: ['cameras'] as const,
  camerasList: (params?: CameraListParams) => ['cameras', 'list', params] as const,
  camera: (id: string) => ['cameras', id] as const,
  demographics: ['demographics'] as const,
  demographicsResults: (params: DemographicsResultsParams) => 
    ['demographics', 'results', params] as const,
};

// Tags Hooks
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => apiClient.getTags(),
  });
}

// Camera Hooks
export function useCameras(params?: CameraListParams) {
  return useQuery({
    queryKey: queryKeys.camerasList(params),
    queryFn: () => apiClient.getCameras(params),
  });
}

export function useCamera(cameraId: string) {
  return useQuery({
    queryKey: queryKeys.camera(cameraId),
    queryFn: () => apiClient.getCamera(cameraId),
    enabled: !!cameraId,
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cameraId, data }: { cameraId: string; data: UpdateCameraData }) =>
      apiClient.updateCamera(cameraId, data),
    onSuccess: (updatedCamera) => {
      // Update the camera in the cache
      queryClient.setQueryData(queryKeys.camera(updatedCamera.id), updatedCamera);
      
      // Invalidate the cameras list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.cameras });
    },
  });
}

// Demographics Hooks
export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDemographicsConfigData) =>
      apiClient.createDemographicsConfig(data),
    onSuccess: (config) => {
      // Invalidate the camera query to get updated demographics config
      queryClient.invalidateQueries({ queryKey: queryKeys.camera(config.camera_id) });
    },
  });
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ configId, data }: { configId: string; data: UpdateDemographicsConfigData }) =>
      apiClient.updateDemographicsConfig(configId, data),
    onSuccess: (config) => {
      // Invalidate the camera query to get updated demographics config
      queryClient.invalidateQueries({ queryKey: queryKeys.camera(config.camera_id) });
    },
  });
}

export function useDeleteDemographicsConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (configId: string) =>
      apiClient.deleteDemographicsConfig(configId),
    onSuccess: () => {
      // Invalidate all camera queries to refresh the data
      queryClient.invalidateQueries({ queryKey: queryKeys.cameras });
    },
  });
}

export function useDemographicsResults(params: DemographicsResultsParams) {
  return useQuery({
    queryKey: queryKeys.demographicsResults(params),
    queryFn: () => apiClient.getDemographicsResults(params),
    enabled: !!params.camera_id,
  });
} 