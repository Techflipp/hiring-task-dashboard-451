import { Camera, DemographicsConfig, DemographicsResult, Tag } from "@/types";
import { Gender, AgeGroup, Emotion, EthnicGroup } from "@/types/enums";

export const mockTags: Tag[] = [
  { id: "1", name: "Entrance" },
  { id: "2", name: "Exit" },
  { id: "3", name: "Indoor" },
  { id: "4", name: "Outdoor" },
];

export const mockCamera: Camera = {
  id: "123",
  name: "Main Entrance Camera",
  rtsp_url: "rtsp://192.168.1.100/stream",
  stream_frame_width: 1920,
  stream_frame_height: 1080,
  stream_max_length: 3600,
  stream_quality: 95,
  stream_fps: 30,
  stream_skip_frames: 0,
  tags: [mockTags[0], mockTags[2]],
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockDemographicsConfig: DemographicsConfig = {
  id: "456",
  camera_id: "123",
  track_history_max_length: 30,
  exit_threshold: 100,
  min_track_duration: 5,
  detection_confidence_threshold: 0.7,
  demographics_confidence_threshold: 0.8,
  min_track_updates: 10,
  box_area_threshold: 0.1,
  save_interval: 600,
  frame_skip_interval: 1.0,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export const mockDemographicsResults: DemographicsResult[] = [
  {
    id: "1",
    camera_id: "123",
    gender: Gender.MALE,
    age: AgeGroup.NINETEEN_THIRTY,
    emotion: Emotion.HAPPY,
    ethnicity: EthnicGroup.WHITE,
    confidence: 0.95,
    timestamp: "2024-01-01T10:00:00Z",
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    camera_id: "123",
    gender: Gender.FEMALE,
    age: AgeGroup.THIRTYONE_FORTYFIVE,
    emotion: Emotion.NEUTRAL,
    ethnicity: EthnicGroup.ASIAN,
    confidence: 0.89,
    timestamp: "2024-01-01T10:05:00Z",
    created_at: "2024-01-01T10:05:00Z",
  },
];
