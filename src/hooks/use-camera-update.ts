import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "@/services/api/api";
import type { components } from "@/services/api/types";

export function useCameraUpdate() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cameraId,
      data,
    }: {
      cameraId: string;
      data: components["schemas"]["CameraUpdate"];
    }) => {
      const { data: updatedCamera, error } = await api.PUT(
        "/cameras/{camera_id}",
        {
          params: { path: { camera_id: cameraId } },
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      return updatedCamera;
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar("Camera updated successfully!", { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["camera", variables.cameraId],
      });
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      if (error.data?.detail) {
        // Handle validation errors from API
        const validationErrors = error.data.detail;
        const errorMessages = validationErrors
          .map((err: any) => err.msg)
          .join(", ");
        enqueueSnackbar(`Validation error: ${errorMessages}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Failed to update camera. Please try again.", {
          variant: "error",
        });
      }
    },
  });
}
