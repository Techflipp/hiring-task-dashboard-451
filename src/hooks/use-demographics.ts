import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demographicsService } from "@/services";
import {
  DemographicsConfigCreatePayload,
  DemographicsConfigUpdatePayload,
  DemographicsResultsParams,
} from "@/types";

export const DEMOGRAPHICS_CONFIG_QUERY_KEY = "demographics-config";
export const DEMOGRAPHICS_RESULTS_QUERY_KEY = "demographics-results";

export function useDemographicsResults(params: DemographicsResultsParams) {
  return useQuery({
    queryKey: [DEMOGRAPHICS_RESULTS_QUERY_KEY, params],
    queryFn: () => demographicsService.getResults(params),
    enabled: !!params.camera_id,
  });
}
export function useCreateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DemographicsConfigCreatePayload) =>
      demographicsService.createConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera"] });
    },
  });
}

export function useUpdateDemographicsConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DemographicsConfigUpdatePayload;
    }) => demographicsService.updateConfig(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera"] });
    },
  });
}
