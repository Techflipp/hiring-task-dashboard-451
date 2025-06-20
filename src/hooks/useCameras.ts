'use client'
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

 
type Params = {
  page?: number;
  size?: number;
  camera_name?: string;
};

export const useCameras = (params: Params = {}) => {
  return useQuery({
    queryKey: ['cameras', params],
    queryFn: async () => {
      const res = await api.get('/cameras/', { params });
      console.log(res)
      return res.data;
    },
  });
};
