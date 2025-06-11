import { useQuery } from '@tanstack/react-query';
import { tagsApi } from '../api/tags';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.list,
  });
};