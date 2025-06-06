import { Gender, AgeGroup, Emotion, EthnicGroup } from "./enums";

export interface Tag {
  id: string;
  name: string;
}

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

export interface CameraUpdatePayload {
  name: string;
  rtsp_url: string;
  stream_frame_width?: number;
  stream_frame_height?: number;
  stream_max_length?: number;
  stream_quality?: number;
  stream_fps?: number;
  stream_skip_frames?: number;
  tags?: string[];
  [key: string]: string | number | string[] | undefined;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

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
  [key: string]: string | number | undefined;
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

export interface DemographicsConfigCreatePayload {
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
  [key: string]: string | number | undefined;
}

export interface DemographicsConfigUpdatePayload {
  track_history_max_length?: number;
  exit_threshold?: number;
  min_track_duration?: number;
  detection_confidence_threshold?: number;
  demographics_confidence_threshold?: number;
  min_track_updates?: number;
  box_area_threshold?: number;
  save_interval?: number;
  frame_skip_interval?: number;
  [key: string]: number | undefined;
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
  created_at: string;
}

export interface DemographicsResultsParams {
  camera_id: string;
  gender?: Gender;
  age?: AgeGroup;
  emotion?: Emotion;
  ethnicity?: EthnicGroup;
  start_date?: string;
  end_date?: string;
}

export interface ApiAnalytics {
  age_distribution: Record<string, number>;
  emotion_distribution: Record<string, number>;
  ethnicity_distribution: Record<string, number>;
  gender_distribution: Record<string, number>;
}

export interface DemographicsAnalytics {
  total: number;
  gender: Record<Gender, number>;
  age: Record<AgeGroup, number>;
  emotion: Record<Emotion, number>;
  ethnicity: Record<EthnicGroup, number>;
}

export interface DemographicsResponse {
  items: DemographicsResult[];
  analytics: ApiAnalytics;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  count: number;
  gender?: Record<Gender, number>;
  age?: Record<AgeGroup, number>;
  emotion?: Record<Emotion, number>;
  ethnicity?: Record<EthnicGroup, number>;
}
