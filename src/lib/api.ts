import {
  CameraDetails,
  CamerasApiResponse,
  DemographicsResult,
  FieldValidationError,
  Tag,
  UpdateCameraData,
  UpdateDemographicsData,
  ValidationErrorResponse,
} from "@/types/camera";

import { notFound } from "next/navigation";
import { endpoints } from "./endpoints";

const baseUrl = "https://task-451-api.ryd.wafaicloud.com"; // should add in env or config file
const appendBaseUrl = (url: string) => `${baseUrl}${url}`;

type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: FieldValidationError;
    };

// get all camera list
export async function getCameras(
  search?: string,
  page = 1,
  size = 5
): Promise<CamerasApiResponse> {
  try {
    const url = new URL(appendBaseUrl(endpoints.get_cameras));
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    url.searchParams.append("camera_name", search ?? "");

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });
    const data: CamerasApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching camera details:", error);
    return notFound();
  }
}
export const getCameraDetails = async (
  cameraId: string
): Promise<CameraDetails> => {
  try {
    const endpoint = endpoints.get_camera.replace("{camera_id}", cameraId);
    const url = new URL(appendBaseUrl(endpoint));
    const response = await fetch(url.toString());
    const data: CameraDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching camera details:", error);
    return notFound();
  }
};
const constructErrorData = (errorData: ValidationErrorResponse) => {
  const errors: FieldValidationError = {};
  errorData.detail.forEach((error) => {
    const field = error.loc[error.loc.length - 1];
    errors[field] = error.msg;
  });
  return errors;
};
export const updateCameraAPI = async (
  cameraId: string,
  formData: UpdateCameraData
): Promise<ApiResponse<CameraDetails>> => {
  try {
    const endpoint = endpoints.update_camera.replace("{camera_id}", cameraId);
    const url = new URL(appendBaseUrl(endpoint));
    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json();
        const errors: FieldValidationError = constructErrorData(errorData);

        return { success: false, errors };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CameraDetails = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating camera:", error);
    return {
      success: false,
      errors: {
        field: "Network error occurred",
      },
    };
  }
};

export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const endpoint = endpoints.get_tags;
    const url = new URL(appendBaseUrl(endpoint));
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 * 24 },
    }); // keep in cache for 1 day
    const data: Tag[] = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};

export const addDemographicConfigAPI = async (
  formData: UpdateDemographicsData
): Promise<ApiResponse<CameraDetails>> => {
  try {
    const endpoint = endpoints.add_demographics;
    const url = new URL(appendBaseUrl(endpoint));
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json();
        const errors: FieldValidationError = constructErrorData(errorData);
        return { success: false, errors };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CameraDetails = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating camera:", error);
    return {
      success: false,
      errors: {
        field: "Network error occurred",
      },
    };
  }
};

export const updateDemographicConfigAPI = async (
  configId: string,
  formData: UpdateDemographicsData
): Promise<ApiResponse<CameraDetails>> => {
  try {
    const endpoint = endpoints.update_demographics.replace(
      "{config_id}",
      configId
    );
    const url = new URL(appendBaseUrl(endpoint));
    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json();
        const errors: FieldValidationError = constructErrorData(errorData);
        return { success: false, errors };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CameraDetails = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating camera:", error);
    return {
      success: false,
      errors: {
        field: "Network error occurred",
      },
    };
  }
};

export async function getDemographicsResults(
  cameraId: string,
  query?: {
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  }
): Promise<DemographicsResult> {
  try {
    const url = new URL(appendBaseUrl(endpoints.get_demographics_results));
    url.searchParams.append("camera_id", cameraId.toString());
    if (query !== undefined) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.append(key, value);
      }
    }

    const response = await fetch(url.toString());
    const data: DemographicsResult = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching demographics results:", error);
    return {} as DemographicsResult; // Return an empty object or handle as appropriate
  }
}
