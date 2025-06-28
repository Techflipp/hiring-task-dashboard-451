import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/app/library/api';

export const useUpdateCamera = (id: string | Array<string> | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedData: any) => {
            console.log('📡 Updating camera with:', updatedData);

            const res = await api.put(`/cameras/${id}`, updatedData);
            return res.data;

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['camera', id] });
            queryClient.invalidateQueries({ queryKey: ['cameras'] });
        },
    });
};
