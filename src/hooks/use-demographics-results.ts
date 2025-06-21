import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/api";

type DemographicsResultsFilters = {
  camera_id: string;
  gender?: string | null;
  age?: string | null;
  emotion?: string | null;
  ethnicity?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export function useDemographicsResults(filters: DemographicsResultsFilters) {
  return useQuery({
    queryKey: ["demographics-results", filters],
    queryFn: async () => {
      const filteredParams = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value != null && value !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const { data, error } = await api.GET("/demographics/results", {
        params: {
          query: { camera_id: filteredParams.camera_id, ...filteredParams },
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!filters.camera_id,
  });
}
