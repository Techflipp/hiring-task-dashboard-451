// app/actions/getCameraDetails.ts
'use server';

import { BASE_API_URL } from '@/server/constants/endpoints';
import { createApiResponse } from '@/server/utils/response.utils';

import {
  EditCameraDetailsInput,
  EditCameraDetailsSchema,
  GetCameraByIdInput,
  GetCameraByIdInputSchema,
  GetCamerasListInput,
  GetCamerasListInputSchema,
} from './cameras.inputs';
import { CameraDetailsResponseType, CameraListResponseType } from './cameras.response';

export async function getCamerasList(params: GetCamerasListInput) {
  try {
    const validated = GetCamerasListInputSchema.safeParse(params);
    if (!validated.success) {
      return createApiResponse<CameraListResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid query parameters',
      });
    }

    const { camera_name, page, size } = validated.data;

    const query = new URLSearchParams({
      camera_name,
      page: page.toString(),
      size: size.toString(),
    }).toString();

    const res = await fetch(`${BASE_API_URL}/cameras?${query}`);

    if (!res.ok) {
      const err = await res.text();
      return createApiResponse<CameraListResponseType>({
        success: false,
        message: 'API request failed',
        error: err || 'Unknown error',
      });
    }

    const json = await res.json();

    return createApiResponse<CameraListResponseType>({
      success: true,
      message: 'Cameras list fetched successfully',
      data: json,
    });
  } catch (error) {
    const apiError = error as Error;
    return createApiResponse<CameraListResponseType>({
      success: false,
      message: 'Unexpected error',
      error: apiError.message || 'Something went wrong',
    });
  }
}

export async function getCameraById(params: GetCameraByIdInput) {
  try {
    const validated = GetCameraByIdInputSchema.safeParse(params);
    if (!validated.success) {
      return createApiResponse<CameraDetailsResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid query parameters',
      });
    }

    const { camera_id } = validated.data;

    const res = await fetch(`${BASE_API_URL}/cameras/${camera_id}`);

    if (!res.ok) {
      const err = await res.text();
      return createApiResponse<CameraDetailsResponseType>({
        success: false,
        message: 'API request failed',
        error: err || 'Unknown error',
      });
    }

    const json = await res.json();

    return createApiResponse<CameraDetailsResponseType>({
      success: true,
      message: 'Camera details fetched successfully',
      data: json,
    });
  } catch (error) {
    const apiError = error as Error;
    return createApiResponse<CameraDetailsResponseType>({
      success: false,
      message: 'Unexpected error',
      error: apiError.message || 'Something went wrong',
    });
  }
}

export async function editCameraDetails(camera_id: string, params: EditCameraDetailsInput) {
  try {
    if (!camera_id) {
      return createApiResponse<CameraDetailsResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid camera id',
      });
    }

    const validated = EditCameraDetailsSchema.safeParse(params);
    if (!validated.success) {
      return createApiResponse<CameraDetailsResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid query parameters',
      });
    }

    const res = await fetch(`${BASE_API_URL}/cameras/${camera_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.text();
      return createApiResponse<CameraDetailsResponseType>({
        success: false,
        message: 'API request failed',
        error: err || 'Unknown error',
      });
    }

    const json = await res.json();

    return createApiResponse<CameraDetailsResponseType>({
      success: true,
      message: 'Camera details updated successfully',
      data: json,
    });
  } catch (error) {
    const apiError = error as Error;
    return createApiResponse<CameraDetailsResponseType>({
      success: false,
      message: 'Unexpected error',
      error: apiError.message || 'Something went wrong',
    });
  }
}
