// API Types based on the specification
export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  tags: Tag[];
  is_active: boolean;
  status_message: string;
  snapshot: string;
  created_at: string;
  updated_at: string;
}

export interface CameraDetail {
  id: string;
  name: string;
  rtsp_url: string;
  tags: Tag[];
  is_active: boolean;
  status_message: string;
  snapshot: string;
  created_at: string;
  updated_at: string;
  stream_frame_width: number;
  stream_frame_height: number;
  stream_max_length: number;
  stream_quality: number;
  stream_fps: number;
  stream_skip_frames: number;
  demographics_config: DemographicsConfig | null;
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
  created_at: string;
  updated_at: string;
}

export interface DemographicsResult {
  count: number;
  gender: Gender;
  age: Age;
  emotion: Emotion;
  ethnicity: EthnicGroup;
  id: string;
  config_id: string;
  created_at: string;
}

export interface Analytics {
  gender_distribution: Record<string, number>;
  age_distribution: Record<string, number>;
  emotion_distribution: Record<string, number>;
  ethnicity_distribution: Record<string, number>;
  total_count: number;
}

export interface DemographicsResultsResponse {
  items: DemographicsResult[];
  analytics: Analytics;
}

// Enums
export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export enum Age {
  ZERO_EIGHTEEN = "0-18",
  NINETEEN_THIRTY = "19-30",
  THIRTYONE_FORTYFIVE = "31-45",
  FORTYSIX_SIXTY = "46-60",
  SIXTYPLUS = "60+"
}

export enum Emotion {
  ANGRY = "angry",
  FEAR = "fear",
  HAPPY = "happy",
  NEUTRAL = "neutral",
  SAD = "sad",
  SURPRISE = "surprise"
}

export enum EthnicGroup {
  WHITE = "white",
  AFRICAN = "african",
  SOUTH_ASIAN = "south_asian",
  EAST_ASIAN = "east_asian",
  MIDDLE_EASTERN = "middle_eastern"
}

// API Request/Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CameraListParams {
  page?: number;
  size?: number;
  camera_name?: string;
}

export interface UpdateCameraData {
  name: string;
  rtsp_url: string;
  stream_frame_width?: number;
  stream_frame_height?: number;
  stream_max_length?: number;
  stream_quality?: number;
  stream_fps?: number;
  stream_skip_frames?: number;
  tags?: string[];
}

export interface CreateDemographicsConfigData {
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

export interface UpdateDemographicsConfigData {
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

export interface DemographicsResultsParams {
  camera_id: string;
  gender?: Gender;
  age?: Age;
  emotion?: Emotion;
  ethnicity?: EthnicGroup;
  start_date?: string;
  end_date?: string;
}

// ApiError is defined as a class in the API client
export interface ApiErrorData {
  detail: string;
  status: number;
} 