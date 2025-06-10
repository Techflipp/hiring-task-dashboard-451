'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { DemographicsFilters, DemographicsConfig } from '../lib/types';

export function useDemographicsResults(filters: DemographicsFilters) {
  return useQuery({
    queryKey: ['demographics', filters],
    queryFn: () => apiClient.getDemographicsResults(filters),
    enabled: !!filters.camera_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<DemographicsConfig, 'id'>) =>
      apiClient.createDemographicsConfig(data),
    onSuccess: (config) => {
      // Invalidate camera to refresh demographics config
      queryClient.invalidateQueries({ queryKey: ['camera', config.camera_id] });
    },
  });
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DemographicsConfig> }) =>
      apiClient.updateDemographicsConfig(id, data),
    onSuccess: (config) => {
      // Invalidate camera to refresh demographics config
      queryClient.invalidateQueries({ queryKey: ['camera', config.camera_id] });
    },
  });
}