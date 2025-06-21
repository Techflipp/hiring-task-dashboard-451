import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/api";
import { useSnackbar } from "notistack";

interface UseCamerasParams {
  page: number;
  size: number;
  cameraName?: string;
}

export function useCameras({ page, size, cameraName }: UseCamerasParams) {
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: ["cameras", page, size, cameraName],
    queryFn: async () => {
      const { data, error } = await api.GET("/cameras/", {
        params: {
          query: {
            page,
            size,
            camera_name: cameraName || undefined,
          },
        },
      });

      if (error) {
        enqueueSnackbar("Error loading cameras. Please try again later.", {
          variant: "error",
        });
        throw error;
      }

      return data;
    },
  });
}
