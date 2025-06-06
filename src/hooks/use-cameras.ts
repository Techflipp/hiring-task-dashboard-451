import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { camerasService } from "@/services";
import { CameraListParams, CameraUpdatePayload, Camera } from "@/types";

export const CAMERAS_QUERY_KEY = "cameras";
export const CAMERA_QUERY_KEY = "camera";

export function useCameras(params?: CameraListParams) {
  return useQuery({
    queryKey: [CAMERAS_QUERY_KEY, params],
    queryFn: () => camerasService.getCameras(params),
  });
}

export function useCamera(id: string) {
  return useQuery({
    queryKey: [CAMERA_QUERY_KEY, id],
    queryFn: () => camerasService.getCameraById(id),
    enabled: !!id,
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CameraUpdatePayload }) =>
      camerasService.updateCamera(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [CAMERA_QUERY_KEY, id] });

      const previousCamera = queryClient.getQueryData([CAMERA_QUERY_KEY, id]);

      queryClient.setQueryData(
        [CAMERA_QUERY_KEY, id],
        (old: Camera | undefined) => ({
          ...old,
          ...data,
        })
      );

      return { previousCamera, id };
    },
    onError: (err, variables, context) => {
      if (context?.previousCamera) {
        queryClient.setQueryData(
          [CAMERA_QUERY_KEY, context.id],
          context.previousCamera
        );
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAMERAS_QUERY_KEY] });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [CAMERA_QUERY_KEY, data.id],
        });
      }
    },
  });
}
