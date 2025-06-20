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
  tags?: string[];
  demographics_config?: DemographicsConfig;
}

interface DemographicsConfig {
  id: string;
  camera_id: string;
  track_history_max_length?: number;
  exit_threshold?: number;
  // Add other config fields as needed
}

export interface CameraDetails {
  id: string;
  name: string;
  rtsp_url: string;
  stream_frame_width?: number;
  stream_frame_height?: number;
  stream_max_length?: number;
  stream_quality?: number;
  stream_fps?: number;
  stream_skip_frames?: number;
  tags?: string[];
  demographics_config?: DemographicsConfig;
}

export interface CameraListProps {
  cameras: Camera[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
}