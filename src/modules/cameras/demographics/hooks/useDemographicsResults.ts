'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/app/library/api';

type DemographicsFilter = {
    camera_id: string;
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
};

export function useDemographicsResults(filters: DemographicsFilter) {
    return useQuery({
        queryKey: ['demographics', filters],
        queryFn: async () => {
            const { data } = await api.get('/demographics/results', { params: filters });
            return data;
        },
        enabled: Boolean(filters.camera_id),
        staleTime: 5 * 60 * 1000, // 5 دقائق
    });
}
