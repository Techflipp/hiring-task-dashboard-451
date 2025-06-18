import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { api } from "@/services/api/api";
import type { components } from "@/services/api/types";

export function useDemographicsConfigCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: components["schemas"]["DemographicsConfigCreate"]
    ) => {
      const { data: createdConfig, error } = await api.POST(
        "/demographics/config",
        {
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      return createdConfig;
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar("Demographics configuration created successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["camera", variables.camera_id],
      });
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      if (error.data?.detail) {
        const validationErrors = error.data.detail;
        const errorMessages = validationErrors
          .map((err: any) => err.msg)
          .join(", ");
        enqueueSnackbar(`Validation error: ${errorMessages}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Failed to create demographics configuration. Please try again.",
          {
            variant: "error",
          }
        );
      }
    },
  });
}

export function useDemographicsConfigUpdate() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      configId,
      data,
    }: {
      configId: string;
      data: components["schemas"]["DemographicsConfigUpdate"];
    }) => {
      const { data: updatedConfig, error } = await api.PUT(
        "/demographics/config/{config_id}",
        {
          params: { path: { config_id: configId } },
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      return updatedConfig;
    },
    onSuccess: (data, variables) => {
      enqueueSnackbar("Demographics configuration updated successfully!", {
        variant: "success",
      });
      // Invalidate camera query to refresh the demographics config
      queryClient.invalidateQueries({
        queryKey: ["camera"],
      });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      if (error.data?.detail) {
        const validationErrors = error.data.detail;
        const errorMessages = validationErrors
          .map((err: any) => err.msg)
          .join(", ");
        enqueueSnackbar(`Validation error: ${errorMessages}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Failed to update demographics configuration. Please try again.",
          {
            variant: "error",
          }
        );
      }
    },
  });
}
