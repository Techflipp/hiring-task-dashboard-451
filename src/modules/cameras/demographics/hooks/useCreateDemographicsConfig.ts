import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/library/api';

export const useCreateDemographicsConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post('/demographics/config', payload);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cameraDetails', variables.camera_id] });
        },
    });
};
