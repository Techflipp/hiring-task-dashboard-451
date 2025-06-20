export type Gender = 'male' | 'female';
export type Age = '0-18' | '19-30' | '31-45' | '46-60' | '60+';
export type Emotion = 'angry' | 'fear' | 'happy' | 'neutral' | 'sad' | 'surprise';
export type Ethnicity = 'white' | 'african' | 'south_asian' | 'east_asian' | 'middle_eastern';

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
  gender: boolean;
  age: boolean;
  emotion: boolean;
  ethnicity: boolean;
}

export interface DemographicsResult {
  id: string;
  camera_id: string;
  timestamp: string;
  gender: Gender;
  age: Age;
  emotion: Emotion;
  ethnicity: Ethnicity;
  confidence: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
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
}

export interface DemographicsConfigPayload {
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