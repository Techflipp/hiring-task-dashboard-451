export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type DemographicsConfig = {
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
};

export type Camera = {
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
  demographics_config: DemographicsConfig;
};

 