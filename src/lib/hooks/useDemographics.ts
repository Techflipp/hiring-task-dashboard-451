import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  demographicsApi,
  CreateDemographicsConfigData,
  UpdateDemographicsConfigData,
  DemographicsResultsParams,
} from '../api/demographics';

export const useCreateDemographicsConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDemographicsConfigData) =>
      demographicsApi.createConfig(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['camera', data.camera_id] });
    },
  });
};

export const useUpdateDemographicsConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDemographicsConfigData }) =>
      demographicsApi.updateConfig(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['camera', data.camera_id] });
    },
  });
};

export const useDemographicsResults = (params: DemographicsResultsParams) => {
  return useQuery({
    queryKey: ['demographics-results', params],
    queryFn: () => demographicsApi.getResults(params),
    enabled: !!params.camera_id,
  });
};