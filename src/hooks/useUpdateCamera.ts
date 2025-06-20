 
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useUpdateCamera = (cameraId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {

      const res = await api.put(`/cameras/${cameraId}`, data);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
  });
};
