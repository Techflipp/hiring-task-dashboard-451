export interface CameraTag {
  id: string
  name: string
  color: string
}

export interface Camera {
  id: string
  name: string
  rtsp_url: string
  snapshot: string
  tags: CameraTag[]
  is_active: boolean
  status_message: string
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}
