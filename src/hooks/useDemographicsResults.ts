import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useDemographicsResults(
  params: {
    camera_id: string;
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  },
  options = {}
) {
  return useQuery({
    queryKey: ["demographics-results", params],
    queryFn: async () => {
      const { data } = await api.get("/demographics/results", { params });
      return data;
    },
    enabled: !!params.camera_id,
    ...options,
  });
}
