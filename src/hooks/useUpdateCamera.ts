import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useUpdateCamera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      cameraId,
      payload,
    }: {
      cameraId: string | number;
      payload: any;
    }) => {
      const { data } = await api.put(`/cameras/${cameraId}`, payload);
      return data;
    },
    onMutate: async ({ cameraId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["camera", cameraId] });
      const previous = queryClient.getQueryData(["camera", cameraId]);
      queryClient.setQueryData(["camera", cameraId], (old: any) => ({
        ...old,
        ...payload,
      }));
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["camera", variables.cameraId],
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["camera", variables.cameraId],
      });
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
  });
}
