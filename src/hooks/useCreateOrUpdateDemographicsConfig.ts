import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useCreateOrUpdateDemographicsConfig(
  isUpdate: boolean,
  configId?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      if (isUpdate && configId) {
        const { data } = await api.put(
          `/demographics/config/${configId}`,
          payload
        );
        return data;
      } else {
        const { data } = await api.post(`/demographics/config`, payload);
        return data;
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["camera"] });
      const previous = queryClient.getQueryData(["camera"]);
      queryClient.setQueryData(
        ["camera"],
        (old: any) =>
          ({
            ...old,
            demographics_config: { ...old?.demographics_config, ...payload },
          } as any)
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["camera"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["camera"] });
    },
  });
}
