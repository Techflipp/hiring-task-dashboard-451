export interface Camera {
  id: string
  name: string
  rtsp_url: string
  stream_frame_width: number
  stream_frame_height: number
  stream_max_length: number
  stream_quality: number
  stream_fps: number
  stream_skip_frames: number
  tags: Tag[]
  demographics_config?: DemographicsConfig
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
}

export interface DemographicsConfig {
  id: string
  camera_id: string
  track_history_max_length: number
  exit_threshold: number
  min_track_duration: number
  detection_confidence_threshold: number
  demographics_confidence_threshold: number
  min_track_updates: number
  box_area_threshold: number
  save_interval: number
  frame_skip_interval: number
  created_at: string
  updated_at: string
}

export interface DemographicsResult {
  id: string
  camera_id: string
  gender: Gender
  age: Age
  emotion: Emotion
  ethnicity: EthnicGroup
  confidence: number
  timestamp: string
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
