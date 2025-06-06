import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import { Tag } from "@/types";

export const tagsService = {
  async getAllTags(): Promise<Tag[]> {
    return apiClient.get<Tag[]>(API_ENDPOINTS.tags);
  },
};
