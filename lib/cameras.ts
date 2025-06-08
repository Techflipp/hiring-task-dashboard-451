import type { Camera, PaginatedResponse } from "@/lib/types"

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

interface FetchCamerasParams {
  page?: number
  size?: number
  camera_name?: string
}

export async function fetchCameras(params: FetchCamerasParams = {}): Promise<PaginatedResponse<Camera>> {
  const { page = 1, size = 20, camera_name } = params

  const searchParams = new URLSearchParams()
  searchParams.append("page", page.toString())
  searchParams.append("size", size.toString())
  if (camera_name) {
    searchParams.append("camera_name", camera_name)
  }

  const response = await fetch(`${API_BASE_URL}/cameras/?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch cameras: ${response.status}`)
  }

  return response.json()
}

export async function getCameraById(id: string): Promise<Camera> {
  const response = await fetch(`${API_BASE_URL}/cameras/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch camera: ${response.status}`)
  }

  return response.json()
}

export async function updateCamera(id: string, data: any): Promise<Camera> {
  const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update camera: ${response.status}`)
  }

  return response.json()
}
