// Demographics configuration type for a camera
export type DemographicsConfig = {
  ageRange: Ages; // e.g. "0-18"
  gender: Genders; // e.g. "male", "female"
  ethnicity: EthnicGroups; // e.g. "white", "african", etc.
  notes?: string;
};

export enum Genders {
  MALE = "male",
  FEMALE = "female",
}

export enum Ages {
  ZERO_EIGHTEEN = "0-18",
  NINETEEN_THIRTY = "19-30",
  THIRTYONE_FORTYFIVE = "31-45",
  FORTYSIX_SIXTY = "46-60",
  SIXTYPLUS = "60+",
}

export enum Emotions {
  ANGRY = "angry",
  FEAR = "fear",
  HAPPY = "happy",
  NEUTRAL = "neutral",
  SAD = "sad",
  SURPRISE = "surprise",
}

export enum EthnicGroups {
  WHITE = "white",
  AFRICAN = "african",
  SOUTH_ASIAN = "south_asian",
  EAST_ASIAN = "east_asian",
  MIDDLE_EASTERN = "middle_eastern",
}

// API Demographics Config type for create/update and display
export type DemographicsConfigApi = {
  id?: string;
  camera_id?: string;
  track_history_max_length?: number;
  exit_threshold?: number;
  min_track_duration?: number;
  detection_confidence_threshold?: number;
  demographics_confidence_threshold?: number;
  min_track_updates?: number;
  box_area_threshold?: number;
  save_interval?: number;
  frame_skip_interval?: number;
  created_at?: string;
  updated_at?: string;
};
