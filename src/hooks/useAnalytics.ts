'use client'
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

type FilterParams = {
  camera_id: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
};

export const useAnalytics = (filters: FilterParams) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      const res = await api.get('/demographics/results', { params: filters });
      return res.data;
    },
    enabled: !!filters.camera_id,
  });
};
