import { useQuery } from '@tanstack/react-query';
import api from '@/app/library/api';

interface Camera {
    id: string;
    name: string;
}


interface CamerasResponse {
    cameras: Camera[];
    total: number;
}

export const useCameras = (page :number = 1 , search:string = '', size:number = 10) => {
    return useQuery<CamerasResponse>({
        queryKey: ['cameras', page, search, size],
        queryFn: async () => {
            const res = await api.get('/cameras/', {
                params: {
                    page,
                    size,
                    camera_name: search || undefined,
                },
            });

            return {
                cameras: res.data.items,
                total: res.data.total,
            };
        },
        // keepPreviousData: true,
    });
};
