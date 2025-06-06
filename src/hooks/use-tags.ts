import { useQuery } from "@tanstack/react-query";
import { tagsService } from "@/services";

export const TAGS_QUERY_KEY = "tags";

export function useTags() {
  return useQuery({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: tagsService.getAllTags,
    staleTime: 5 * 60 * 1000,
  });
}
