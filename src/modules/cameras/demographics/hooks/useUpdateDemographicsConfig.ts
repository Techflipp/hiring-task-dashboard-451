import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/library/api';

export const useUpdateDemographicsConfig = (configId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.put(`/demographics/config/${configId}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cameraDetails'] });
        },
    });
};
