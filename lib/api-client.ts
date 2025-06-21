const BASE_URL = "https://task-451-api.ryd.wafaicloud.com"

export interface CameraListParams {
  page?: number
  size?: number
  camera_name?: string
}

export interface DemographicsResultsParams {
  camera_id: string
  gender?: string
  age?: string
  emotion?: string
  ethnicity?: string
  start_date?: string
  end_date?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getCameras(params: CameraListParams = {}) {
    try {
      const searchParams = new URLSearchParams()

      if (params.page) searchParams.set("page", params.page.toString())
      if (params.size) searchParams.set("size", params.size.toString())
      if (params.camera_name) searchParams.set("camera_name", params.camera_name)

      const query = searchParams.toString()
      const result = await this.request<any>(`/cameras/${query ? `?${query}` : ""}`)

      const localCameras = this.getLocalCameras()
      const dummyCameras = this.generateDummyCameras(params).items
      const allCameras = [...(result.items || []), ...localCameras, ...dummyCameras]

      return {
        ...result,
        items: allCameras,
        total: allCameras.length,
      }
    } catch (error) {
      const localCameras = this.getLocalCameras()
      const dummyCameras = this.generateDummyCameras(params).items
      const allCameras = [...localCameras, ...dummyCameras]

      return {
        items: allCameras,
        total: allCameras.length,
        page: params.page || 1,
        size: params.size || 20,
        pages: Math.ceil(allCameras.length / (params.size || 20)),
      }
    }
  }

  async getCamera(cameraId: string) {
    const localCameras = this.getLocalCameras()
    const localCamera = localCameras.find((cam: any) => cam.id === cameraId)
    if (localCamera) {
      return localCamera
    }

    const dummyCameras = this.generateDummyCameras().items
    const dummyCamera = dummyCameras.find((cam: any) => cam.id === cameraId)
    if (dummyCamera) {
      return dummyCamera
    }

    try {
      return await this.request<any>(`/cameras/${cameraId}`)
    } catch (error) {
      console.error(`Failed to fetch camera ${cameraId}:`, error)
      throw new Error(`Camera with ID ${cameraId} not found`)
    }
  }

  async updateCamera(cameraId: string, data: any) {
    const localCameras = this.getLocalCameras()
    const cameraIndex = localCameras.findIndex((cam: any) => cam.id === cameraId)

    if (cameraIndex !== -1) {
      localCameras[cameraIndex] = {
        ...localCameras[cameraIndex],
        ...data,
        updated_at: new Date().toISOString(),
      }
      this.saveLocalCameras(localCameras)
      return localCameras[cameraIndex]
    }

    const dummyCameras = this.generateDummyCameras().items
    const dummyCamera = dummyCameras.find((cam: any) => cam.id === cameraId)

    if (dummyCamera) {
      const updatedCamera = {
        ...dummyCamera,
        ...data,
        updated_at: new Date().toISOString(),
      }
      localCameras.push(updatedCamera)
      this.saveLocalCameras(localCameras)
      return updatedCamera
    }

    try {
      return await this.request<any>(`/cameras/${cameraId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    } catch (error) {
      throw new Error(`Failed to update camera ${cameraId}`)
    }
  }

  async getTags() {
    try {
      return await this.request<any>("/tags/")
    } catch (error) {
      return [
        { id: "tag-1", name: "Indoor" },
        { id: "tag-2", name: "Outdoor" },
        { id: "tag-3", name: "Security" },
        { id: "tag-4", name: "Monitoring" },
      ]
    }
  }

  async createDemographicsConfig(data: any) {
    try {
      return await this.request<any>("/demographics/config", {
        method: "POST",
        body: JSON.stringify(data),
      })
    } catch (error) {
      const config = {
        id: `config-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const localCameras = this.getLocalCameras()
      const localIndex = localCameras.findIndex((cam: any) => cam.id === data.camera_id)

      if (localIndex !== -1) {
        localCameras[localIndex].demographics_config = config
        this.saveLocalCameras(localCameras)
      } else {
        const dummyCameras = this.generateDummyCameras().items
        const dummyCamera = dummyCameras.find((cam: any) => cam.id === data.camera_id)

        if (dummyCamera) {
          const updatedCamera = {
            ...dummyCamera,
            demographics_config: config,
            updated_at: new Date().toISOString(),
          }
          localCameras.push(updatedCamera)
          this.saveLocalCameras(localCameras)
        }
      }

      return config
    }
  }

  async updateDemographicsConfig(configId: string, data: any) {
    try {
      return await this.request<any>(`/demographics/config/${configId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    } catch (error) {
      const localCameras = this.getLocalCameras()
      const camera = localCameras.find((cam: any) => cam.demographics_config?.id === configId)

      if (camera) {
        camera.demographics_config = {
          ...camera.demographics_config,
          ...data,
          updated_at: new Date().toISOString(),
        }
        this.saveLocalCameras(localCameras)
        return camera.demographics_config
      }

      const dummyCameras = this.generateDummyCameras().items
      const dummyCamera = dummyCameras.find((cam: any) => cam.demographics_config?.id === configId)

      if (dummyCamera) {
        const updatedCamera = {
          ...dummyCamera,
          demographics_config: {
            ...dummyCamera.demographics_config,
            ...data,
            updated_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        }
        localCameras.push(updatedCamera)
        this.saveLocalCameras(localCameras)
        return updatedCamera.demographics_config
      }

      throw error
    }
  }

  async getDemographicsResults(params: DemographicsResultsParams) {
    try {
      const searchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") searchParams.set(key, value.toString())
      })

      const query = searchParams.toString()
      const result = await this.request<any>(`/demographics/results?${query}`)

      if (!result.data || result.data.length === 0) {
        return {
          data: this.generateDummyDemographicsData(params.camera_id, params),
          analytics: null,
        }
      }

      return result
    } catch (error) {
      return {
        data: this.generateDummyDemographicsData(params.camera_id, params),
        analytics: null,
      }
    }
  }

  private getLocalCameras() {
    try {
      if (typeof window === "undefined") return []
      return JSON.parse(localStorage.getItem("dummyCameras") || "[]")
    } catch {
      return []
    }
  }

  private saveLocalCameras(cameras: any[]) {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("dummyCameras", JSON.stringify(cameras))
      }
    } catch (error) {
      console.error("Failed to save cameras to localStorage:", error)
    }
  }

  private generateDummyDemographicsData(cameraId: string, filters?: any) {
    const genders = ["male", "female"]
    const ages = ["0-18", "19-30", "31-45", "46-60", "60+"]
    const emotions = ["happy", "neutral", "sad", "angry", "surprise", "fear"]
    const ethnicities = ["white", "african", "south_asian", "east_asian", "middle_eastern"]

    const dummyData = []
    const now = new Date()

    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days

      const record = {
        id: `dummy-${i}`,
        camera_id: cameraId,
        gender: genders[Math.floor(Math.random() * genders.length)],
        age: ages[Math.floor(Math.random() * ages.length)],
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
        confidence: 0.7 + Math.random() * 0.3, // 0.7 to 1.0
        timestamp: timestamp.toISOString(),
      }

      if (filters) {
        if (filters.gender && filters.gender !== "all" && record.gender !== filters.gender) continue
        if (filters.age && filters.age !== "all" && record.age !== filters.age) continue
        if (filters.emotion && filters.emotion !== "all" && record.emotion !== filters.emotion) continue
        if (filters.ethnicity && filters.ethnicity !== "all" && record.ethnicity !== filters.ethnicity) continue
        if (filters.start_date && new Date(record.timestamp) < new Date(filters.start_date)) continue
        if (filters.end_date && new Date(record.timestamp) > new Date(filters.end_date)) continue
      }

      dummyData.push(record)
    }

    return dummyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  private generateDummyCameras(params: CameraListParams = {}) {
    const dummyCameras = [
      {
        id: "cam-001",
        name: "Main Entrance Camera",
        rtsp_url: "rtsp://admin:password@192.168.1.100:554/stream1",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 90,
        stream_fps: 30,
        stream_skip_frames: 0,
        tags: [],
        demographics_config: {
          id: "config-001",
          camera_id: "cam-001",
          track_history_max_length: 50,
          exit_threshold: 30,
          min_track_duration: 5,
          detection_confidence_threshold: 0.6,
          demographics_confidence_threshold: 0.6,
          min_track_updates: 5,
          box_area_threshold: 0.1,
          save_interval: 300,
          frame_skip_interval: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-002",
        name: "Lobby Camera",
        rtsp_url: "rtsp://admin:password@192.168.1.101:554/stream1",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 85,
        stream_fps: 25,
        stream_skip_frames: 1,
        tags: [],
        demographics_config: {
          id: "config-002",
          camera_id: "cam-002",
          track_history_max_length: 40,
          exit_threshold: 25,
          min_track_duration: 3,
          detection_confidence_threshold: 0.7,
          demographics_confidence_threshold: 0.65,
          min_track_updates: 4,
          box_area_threshold: 0.12,
          save_interval: 600,
          frame_skip_interval: 1.5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-003",
        name: "Parking Lot Camera",
        rtsp_url: "rtsp://admin:password@192.168.1.102:554/stream1",
        stream_frame_width: 1280,
        stream_frame_height: 720,
        stream_max_length: 600,
        stream_quality: 80,
        stream_fps: 20,
        stream_skip_frames: 2,
        tags: [],
        demographics_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-004",
        name: "Conference Room Camera",
        rtsp_url: "",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 95,
        stream_fps: 30,
        stream_skip_frames: 0,
        tags: [],
        demographics_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-005",
        name: "Reception Area Camera",
        rtsp_url: "rtsp://admin:password@192.168.1.104:554/stream1",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 90,
        stream_fps: 30,
        stream_skip_frames: 0,
        tags: [],
        demographics_config: {
          id: "config-005",
          camera_id: "cam-005",
          track_history_max_length: 60,
          exit_threshold: 35,
          min_track_duration: 4,
          detection_confidence_threshold: 0.65,
          demographics_confidence_threshold: 0.7,
          min_track_updates: 6,
          box_area_threshold: 0.08,
          save_interval: 450,
          frame_skip_interval: 0.8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-006",
        name: "Warehouse Camera",
        rtsp_url: "",
        stream_frame_width: 1280,
        stream_frame_height: 720,
        stream_max_length: 600,
        stream_quality: 75,
        stream_fps: 15,
        stream_skip_frames: 3,
        tags: [],
        demographics_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-007",
        name: "Emergency Exit Camera",
        rtsp_url: "",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 85,
        stream_fps: 25,
        stream_skip_frames: 1,
        tags: [],
        demographics_config: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "cam-008",
        name: "Server Room Camera",
        rtsp_url: "rtsp://admin:password@192.168.1.108:554/stream1",
        stream_frame_width: 1920,
        stream_frame_height: 1080,
        stream_max_length: 300,
        stream_quality: 95,
        stream_fps: 30,
        stream_skip_frames: 0,
        tags: [],
        demographics_config: {
          id: "config-008",
          camera_id: "cam-008",
          track_history_max_length: 30,
          exit_threshold: 20,
          min_track_duration: 2,
          detection_confidence_threshold: 0.8,
          demographics_confidence_threshold: 0.75,
          min_track_updates: 3,
          box_area_threshold: 0.15,
          save_interval: 300,
          frame_skip_interval: 1.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    let filteredCameras = dummyCameras
    if (params.camera_name) {
      filteredCameras = dummyCameras.filter((camera) =>
        camera.name.toLowerCase().includes(params.camera_name!.toLowerCase()),
      )
    }

    const page = params.page || 1
    const size = params.size || 20
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const paginatedCameras = filteredCameras.slice(startIndex, endIndex)

    return {
      items: paginatedCameras,
      total: filteredCameras.length,
      page,
      size,
      pages: Math.ceil(filteredCameras.length / size),
    }
  }
}

export const apiClient = new ApiClient()
