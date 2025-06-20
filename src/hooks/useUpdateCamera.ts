import { apiClient } from "@/lib/apiClient";
import { CameraFormValues } from "@/lib/validators/cameraSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateCamera = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CameraFormValues) =>
      apiClient.put(`/cameras/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["camera", id] });
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
      toast.success("Camera updated successfully")
    },
    onError: (error) =>{
      toast.error("Error updating camera" + error.message)
    }
  });
};
