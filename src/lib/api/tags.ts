import { apiClient } from './client';
import { Tag } from '../types';

export const tagsApi = {
  list: async (): Promise<Tag[]> => {
    const { data } = await apiClient.get('/tags/');
    return data;
  },
};