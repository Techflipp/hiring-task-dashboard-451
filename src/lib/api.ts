import axios from "axios";

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  stream_frame_width?: number;
  stream_frame_height?: number;
  stream_max_length?: number;
  stream_quality?: number;
  stream_fps?: number;
  stream_skip_frames?: number;
  tags?: Tag[];
  demographics_config?: DemographicsConfig;
}

export interface Tag {
  id: string;
  name: string;
}

export interface DemographicsConfig {
  id: string;
  camera_id: string;
  track_history_max_length?: number;
  exit_threshold?: number;
  min_track_duration?: number;
  detection_confidence_threshold?: number;
  demographics_confidence_threshold?: number;
  min_track_updates?: number;
  box_area_threshold?: number;
  save_interval?: number;
  frame_skip_interval?: number;
}

export interface DemographicsResult {
  id: string;
  camera_id: string;
  gender: "male" | "female";
  age: "0-18" | "19-30" | "31-45" | "46-60" | "60+";
  emotion: "angry" | "fear" | "happy" | "neutral" | "sad" | "surprise";
  ethnicity:
    | "white"
    | "african"
    | "south_asian"
    | "east_asian"
    | "middle_eastern";
  timestamp: string;
  confidence: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Add this type for camera updates
export type CameraUpdateData = Omit<Partial<Camera>, "tags"> & {
  tags?: string[]; // Tag IDs as strings for updates
};

// API functions
export const cameraApi = {
  getCameras: async (params: {
    page?: number;
    size?: number;
    camera_name?: string;
  }): Promise<PaginatedResponse<Camera>> => {
    const response = await api.get("/cameras/", { params });
    return response.data;
  },

  getCamera: async (id: string): Promise<Camera> => {
    const response = await api.get(`/cameras/${id}`);
    return response.data;
  },

  updateCamera: async (id: string, data: CameraUpdateData): Promise<Camera> => {
    const response = await api.put(`/cameras/${id}`, data);
    return response.data;
  },
};

export const demographicsApi = {
  createConfig: async (
    data: Omit<DemographicsConfig, "id">
  ): Promise<DemographicsConfig> => {
    const response = await api.post("/demographics/config", data);
    return response.data;
  },

  updateConfig: async (
    id: string,
    data: Partial<DemographicsConfig>
  ): Promise<DemographicsConfig> => {
    const response = await api.put(`/demographics/config/${id}`, data);
    return response.data;
  },

  getResults: async (params: {
    camera_id: string;
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<DemographicsResult[]> => {
    const response = await api.get("/demographics/results", { params });
    return response.data;
  },
};

export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get("/tags/");
    return response.data;
  },
};
