import type { Tag } from "@/lib/types"

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

export async function getAllTags(): Promise<Tag[]> {
  const response = await fetch(`${API_BASE_URL}/tags/`)

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.status}`)
  }

  return response.json()
}
