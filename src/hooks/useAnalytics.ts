import { apiClient } from "@/lib/apiClient"
import { AnalyticsResponse } from "@/types/analytics.interface"
import { useQuery } from "@tanstack/react-query"

export const useAnalytics = (params: Record<string, string>) => {
  if(!params?.start_date?.length){
    delete params.start_date
  }
  if(!params?.end_date?.length){
    delete params.end_date
  }
  return useQuery<AnalyticsResponse>({
    queryKey: ['demographics', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/demographics/results', { params })
      return data
    },
    enabled: !!params.camera_id, // Only run when camera_id is present
  })
}