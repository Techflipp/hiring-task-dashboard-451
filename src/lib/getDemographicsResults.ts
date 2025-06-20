// lib/getDemographicsResults.ts
import api from "@/lib/axios";

export async function getDemographicsResults(cameraId: string) {
  const res = await api.get('/demographics/results', {
    params: {
      camera_id: cameraId,
    },
  });

  return res.data;
}
