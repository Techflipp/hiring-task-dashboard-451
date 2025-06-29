import { useQuery } from '@tanstack/react-query';
import api from '@/app/library/api';

export const useCameraDetails = (id: string | string[] | undefined) => {
    return useQuery({
        queryKey: ['camera', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await api.get(`/cameras/${id}`);
            return res.data;
        },
    });
};
