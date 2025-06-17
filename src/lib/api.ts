import { AnalyticsData, Camera, DemographicsConfig, PaginatedCameras } from "./types";

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

export const fetchCameras = async (
  page: number = 1,
  size: number = 10,
  camera_name?: string
): Promise<PaginatedCameras> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(camera_name && { camera_name }),
  });

  const response = await fetch(`${API_BASE_URL}/cameras?${params}`);
  if (!response.ok) throw new Error('Failed to fetch cameras');
  return response.json();
};

export const fetchCameraDetails = async (id: string): Promise<Camera> => {
  const response = await fetch(`${API_BASE_URL}/cameras/${id}`);
  if (!response.ok) throw new Error('Failed to fetch camera details');
  return response.json();
};

export const updateCamera = async (id: string, data: Partial<Camera>): Promise<Camera> => {
  const response = await fetch(`${API_BASE_URL}/cameras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update camera');
  return response.json();
};

export const fetchDemographicsConfig = async (camera_id: string): Promise<DemographicsConfig> => {
  const response = await fetch(`${API_BASE_URL}/demographics/config?camera_id=${camera_id}`);
  if (!response.ok) throw new Error('Failed to fetch demographics config');
  return response.json();
};

export const fetchAnalyticsData = async (
    camera_id: string,
    filters?: Record<string, string>
  ): Promise<AnalyticsData> => {
    const params = new URLSearchParams({
      camera_id,
      ...(filters || {}),
    });
  
    const response = await fetch(`${API_BASE_URL}/demographics/results?${params}`);
    if (!response.ok) throw new Error('Failed to fetch analytics data');
    
    const data = await response.json();
    
    // تحويل هيكل البيانات ليتناسب مع المكون
    return {
      gender: data.analytics.gender_distribution,
      age: data.analytics.age_distribution,
      emotion: data.analytics.emotion_distribution,
      ethnicity: data.analytics.ethnicity_distribution,
      timeline: data.timeline || [] // إضافة هذا إذا كان موجوداً في الاستجابة
    };
  };

  // وظيفة جديدة لإنشاء تكوين جديد
export const createDemographicsConfig = async (
  data: DemographicsConfig
): Promise<DemographicsConfig> => {
  const response = await fetch(`${API_BASE_URL}/demographics/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create demographics config');
  return response.json();
};

// وظيفة لتحديث التكوين الحالي
export const updateDemographicsConfig = async (
  config_id: string,
  data: Partial<DemographicsConfig>
): Promise<DemographicsConfig> => {
  const response = await fetch(`${API_BASE_URL}/demographics/config/${config_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update demographics config');
  return response.json();
};