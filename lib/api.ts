const BASE_URL = "https://task-451-api.ryd.wafaicloud.com";

interface CamerasParams {
  page?: number;
  size?: number;
  camera_name?: string;
}

interface DemographicsFilters {
  camera_id: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

export async function getCameras(params: CamerasParams = {}) {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.size) searchParams.append("size", params.size.toString());
    if (params.camera_name)
      searchParams.append("camera_name", params.camera_name);

    const response = await fetch(`${BASE_URL}/cameras/?${searchParams}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch cameras:", error);
    // Return mock data for development
    return {
      items: [],
      total: 0,
      page: 1,
      size: 20,
      pages: 0,
    };
  }
}

export async function getCameraById(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/cameras/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch camera:", error);
    throw error;
  }
}

export async function updateCamera(id: string, data: any) {
  try {
    const response = await fetch(`${BASE_URL}/cameras/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to update camera:", error);
    throw error;
  }
}

export async function getTags() {
  try {
    const response = await fetch(`${BASE_URL}/tags/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

export async function createDemographicsConfig(data: any) {
  try {
    const response = await fetch(`${BASE_URL}/demographics/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to create demographics config:", error);
    throw error;
  }
}

export async function updateDemographicsConfig(id: string, data: any) {
  try {
    const response = await fetch(`${BASE_URL}/demographics/config/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to update demographics config:", error);
    throw error;
  }
}

export async function getDemographicsResults(filters: DemographicsFilters) {
  try {
    const searchParams = new URLSearchParams();

    searchParams.append("camera_id", filters.camera_id);
    if (filters.gender && filters.gender !== "all")
      searchParams.append("gender", filters.gender);
    if (filters.age && filters.age !== "all")
      searchParams.append("age", filters.age);
    if (filters.emotion && filters.emotion !== "all")
      searchParams.append("emotion", filters.emotion);
    if (filters.ethnicity && filters.ethnicity !== "all")
      searchParams.append("ethnicity", filters.ethnicity);
    if (filters.start_date)
      searchParams.append("start_date", filters.start_date);
    if (filters.end_date) searchParams.append("end_date", filters.end_date);

    const response = await fetch(
      `${BASE_URL}/demographics/results?${searchParams}`
    );
    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch demographics results:", error);
    return [];
  }
}
