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
    stream_frame_width?: number;
    stream_frame_height?: number;
    stream_max_length?: number;
    stream_quality?: number;
    stream_fps?: number;
    stream_skip_frames?: number;
    demographics_config?: DemographicsConfig;
  }
  export interface PaginatedCameras {
    items: Camera[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }
  
  export interface DemographicsConfig {
    id?: string;
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
  
  export interface AnalyticsData {
    gender: Record<string, number>;
    age: Record<string, number>;
    emotion: Record<string, number>;
    ethnicity: Record<string, number>;
    timeline?: Array<{ date: string; count: number }>;
  }

  export interface FilterPanelProps {
    show: boolean;
    onClose: () => void;
    filters: Record<string, string>;
    tempFilters: Record<string, string>;
    setTempFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    applyFilters: () => void;
    resetFilters: () => void;
  }

 export interface CameraStreamProps {
    rtspUrl: string;
    snapshotUrl?: string;
  }