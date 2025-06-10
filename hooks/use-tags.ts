'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getTags(),
    staleTime: 15 * 60 * 1000, // 15 minutes - tags don't change often
  });
}