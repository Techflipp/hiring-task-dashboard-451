export interface DemographicsFilters {
  camera_id: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
}

export interface DemographicsResult {
  timestamp: string;
  gender: string;
  age: string;
  emotion: string;
  ethnicity: string;
  confidence: number;
  camera_id: string;
}
