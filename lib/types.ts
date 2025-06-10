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
  created_at: string;
  updated_at: string;
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
  gender: Gender;
  age: AgeGroup;
  emotion: Emotion;
  ethnicity: EthnicGroup;
  confidence: number;
  timestamp: string;
}

export type Gender = "male" | "female";
export type AgeGroup = "0-18" | "19-30" | "31-45" | "46-60" | "60+";
export type Emotion = "angry" | "fear" | "happy" | "neutral" | "sad" | "surprise";
export type EthnicGroup = "white" | "african" | "south_asian" | "east_asian" | "middle_eastern";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CameraFilters {
  page?: number;
  size?: number;
  camera_name?: string;
}

export interface DemographicsFilters {
  camera_id: string;
  gender?: Gender;
  age?: AgeGroup;
  emotion?: Emotion;
  ethnicity?: EthnicGroup;
  start_date?: string;
  end_date?: string;
}