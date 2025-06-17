export interface Tag {
  id: string;
  name: string;
}

export interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  stream_frame_width: number | null;
  stream_frame_height: number | null;
  stream_max_length: number | null;
  stream_quality: number | null;
  stream_fps: number | null;
  stream_skip_frames: number | null;
  tags: Tag[];
  demographics_config: DemographicsConfig | null;
}

export interface DemographicsConfig {
  id: string;
  camera_id: string;
  track_history_max_length: number;
  exit_threshold: number;
  min_track_duration: number;
  detection_confidence_threshold: number;
  demographics_confidence_threshold: number;
  min_track_updates: number;
  box_area_threshold: number;
  save_interval: number;
  frame_skip_interval: number;
}

export interface PaginatedCameras {
  items: Camera[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum Age {
  ZERO_EIGHTEEN = "0-18",
  NINETEEN_THIRTY = "19-30",
  THIRTYONE_FORTYFIVE = "31-45",
  FORTYSIX_SIXTY = "46-60",
  SIXTYPLUS = "60+",
}

export enum Emotion {
  ANGRY = "angry",
  FEAR = "fear",
  HAPPY = "happy",
  NEUTRAL = "neutral",
  SAD = "sad",
  SURPRISE = "surprise",
}

export enum EthnicGroup {
  WHITE = "white",
  AFRICAN = "african",
  SOUTH_ASIAN = "south_asian",
  EAST_ASIAN = "east_asian",
  MIDDLE_EASTERN = "middle_eastern",
}

export interface DemographicsResult {
    id: string;
    camera_id: string;
    timestamp: string;
    gender: Gender;
    age: Age;
    emotion: Emotion;
    ethnicity: EthnicGroup;
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

export interface AnalyticsData {
    // Define properties for analytics data here
    [key: string]: unknown; // Allows for flexible properties
}

export interface DemographicsResponse {
    items: boolean;
    data: boolean;
    results: DemographicsResult[];
    analytics: AnalyticsData;
}
