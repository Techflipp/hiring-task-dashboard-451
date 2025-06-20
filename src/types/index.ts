// Enum definitions
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

// API Response types
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
}

export interface DemographicsResult {
  id: string;
  camera_id: string;
  gender: Gender;
  age: Age;
  emotion: Emotion;
  ethnicity: EthnicGroup;
  timestamp: string;
  confidence: number;
}

export interface DemographicsAnalytics {
  total_detections: number;
  gender_distribution: Record<Gender, number>;
  age_distribution: Record<Age, number>;
  emotion_distribution: Record<Emotion, number>;
  ethnicity_distribution: Record<EthnicGroup, number>;
  hourly_distribution: Record<string, number>;
  daily_distribution: Record<string, number>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Form types
export interface CameraFormData {
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

export interface DemographicsConfigFormData {
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

export interface DemographicsFilters {
  camera_id: string;
  gender?: Gender;
  age?: Age;
  emotion?: Emotion;
  ethnicity?: EthnicGroup;
  start_date?: string;
  end_date?: string;
}

// Error types for form validation
export interface CameraFormErrors {
  name?: string;
  rtsp_url?: string;
  stream_frame_width?: string;
  stream_frame_height?: string;
  stream_max_length?: string;
  stream_quality?: string;
  stream_fps?: string;
  stream_skip_frames?: string;
  tags?: string;
}

export interface DemographicsConfigFormErrors {
  track_history_max_length?: string;
  exit_threshold?: string;
  min_track_duration?: string;
  detection_confidence_threshold?: string;
  demographics_confidence_threshold?: string;
  min_track_updates?: string;
  box_area_threshold?: string;
  save_interval?: string;
  frame_skip_interval?: string;
} 