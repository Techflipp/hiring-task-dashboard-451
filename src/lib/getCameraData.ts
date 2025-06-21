import api from '@/lib/axios';

export async function getCameraData(id: string) {
  try {
    const res = await api.get(`/cameras/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}
