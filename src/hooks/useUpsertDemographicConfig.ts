import { apiClient } from "@/lib/apiClient"
import { DemographicsFormValues } from "@/lib/validators/demographicsSchema"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpsertDemographicsConfig = (cameraId: string, configId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DemographicsFormValues) => {
      if (configId) {
        return apiClient.put(`/demographics/config/${configId}`, data).then((res) => res.data)
      } else {
        return apiClient
          .post(`/demographics/config`, { ...data, camera_id: cameraId })
          .then((res) => res.data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] })
      toast.success("Configuration saved successfully")
    },
    onError: (error) =>{
      toast.error("Error Saving Configuration" + error.message)
    }
  })
}