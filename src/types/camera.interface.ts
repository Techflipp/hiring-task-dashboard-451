export interface CameraTag {
  id: string;
  name: string;
  color: string;
}

export interface Camera {
  id: string;
  name: string;
  rtsp_url: string;
  snapshot: string;
  tags: CameraTag[];
  is_active: boolean;
  status_message: string;
  stream_frame_width:  number;
  stream_frame_height:  number;
  stream_max_length:  number;
  stream_quality:  number;
  stream_fps:  number;
  stream_skip_frames:  number;
  created_at: string;
  updated_at: string;
  "demographics_config": {
    "track_history_max_length": number,
    "exit_threshold": number,
    "min_track_duration": number,
    "detection_confidence_threshold": number,
    "demographics_confidence_threshold":number,
    "min_track_updates": number,
    "box_area_threshold": number,
    "save_interval": number,
    "frame_skip_interval": number,
    "id": string,
    "camera_id": string,
    "created_at": string | Date,
    "updated_at": string | Date
  }
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
