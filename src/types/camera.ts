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

export interface CamerasApiResponse {
  items: Camera[];
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface DemographicsConfig {
  track_history_max_length: number;
  exit_threshold: number;
  min_track_duration: number;
  detection_confidence_threshold: number;
  demographics_confidence_threshold: number;
  min_track_updates: number;
  box_area_threshold: number;
  save_interval: number;
  frame_skip_interval: number;
  id: string;
  camera_id: string;
  created_at: string;
  updated_at: string;
}

export interface CameraDetails {
  id: string;
  name: string;
  rtsp_url: string;
  tags: Tag[]; // Updated to include Tag objects
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
  demographics_config: DemographicsConfig;
}
export type UpdateCameraData = {
  name: string;
  rtsp_url: string;
  stream_frame_width: number;
  stream_frame_height: number;
  stream_max_length: number;
  stream_quality: number;
  stream_fps: number;
  stream_skip_frames: number;
  tags: string[];
};
export type FieldValidationError = {
  [key: string]: string;
};

export interface UpdateDemographicsData {
  track_history_max_length: number;
  exit_threshold: number;
  min_track_duration: number;
  detection_confidence_threshold: number;
  demographics_confidence_threshold: number;
  min_track_updates: number;
  box_area_threshold: number;
  save_interval: number;
  frame_skip_interval: number;
  camera_id?: string;
}

// demographics results
export interface DemographicsDataItem {
  count: number;
  gender: Gender;
  age: AgeRange;
  emotion: Emotion;
  ethnicity: Ethnicity;
  id: string;
  config_id: string;
  created_at: string;
}
export enum AgeRange {
  "0-18" = "0-18",
  "19-30" = "19-30",
  "31-45" = "31-45",
  "46-60" = "46-60",
  "60+" = "60+",
}
export enum Emotion {
  angry = "Angry",
  fear = "Fear",
  happy = "Happy",
  neutral = "Neutral",
  sad = "Sad",
  surprise = "Surprise",
}
export enum Ethnicity {
  white = "White",
  african = "African",
  south_asian = "South Asian",
  east_asian = "East Asian",
  middle_eastern = "Middle Eastern",
}
export enum Gender {
  male = "Male",
  female = "Female",
}
export interface Analytics {
  gender_distribution: Record<string, number>;
  age_distribution: Record<string, number>;
  emotion_distribution: Record<string, number>;
  ethnicity_distribution: Record<string, number>;
  total_count: number;
}

export interface DemographicsResult {
  items: DemographicsDataItem[];
  analytics: Analytics;
}

export interface FilterOptions {
  gender: string;
  age: string;
  emotion: string;
  ethnicity: string;
  start_date: string;
  end_date: string;
}

export interface SelectedFilters {
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
}

interface ValidationErrorDetail {
  type: string;
  loc: (string | number)[];
  msg: string;
  url?: string;
}

export interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}
