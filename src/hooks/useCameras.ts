import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useCameras(
  page = 1,
  size = 20,
  camera_name = "",
  options = {}
) {
  return useQuery({
    queryKey: ["cameras", page, size, camera_name],
    queryFn: async () => {
      const { data } = await api.get("/cameras/", {
        params: { page, size, camera_name },
      });
      return data;
    },
    placeholderData: (prev) => prev,
    ...options,
  });
}
