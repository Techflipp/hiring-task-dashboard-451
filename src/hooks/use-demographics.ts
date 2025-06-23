import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  DemographicsConfig,
  DemographicsConfigPayload,
  DemographicsResult,
} from '@/types/api';

export function useDemographicsResults(
  cameraId: string,
  filters?: {
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  }
) {
  return useQuery<DemographicsResult[]>({
    queryKey: ['demographics-results', cameraId, filters],
    queryFn: () => api.getDemographicsResults(cameraId, filters),
    enabled: !!cameraId,
  });
}

export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { camera_id: string; gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean }) =>
      api.createDemographicsConfig(payload),
    onSuccess: (config) => {
      queryClient.invalidateQueries({
        queryKey: ['camera', config.camera_id],
      });
    },
  });
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      configId,
      payload,
    }: {
      configId: string;
      payload: { gender: boolean; age: boolean; emotion: boolean; ethnicity: boolean };
    }) => api.updateDemographicsConfig(configId, payload),
    onSuccess: (config) => {
      queryClient.invalidateQueries({
        queryKey: ['camera', config.camera_id],
      });
    },
  });
} 