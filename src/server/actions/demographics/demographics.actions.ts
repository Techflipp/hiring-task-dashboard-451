/* eslint-disable complexity */
import { BASE_API_URL } from '@/server/constants/endpoints';
import { createApiResponse } from '@/server/utils/response.utils';

import {
  EditCameraDemographicsConfigInput,
  EditCameraDemographicsConfigSchema,
  GetDemographicsInput,
  GetDemographicsInputSchema,
} from './demographics.inputs';
import {
  CameraDemographicsConfigResponseType,
  DemographicsDetailsResponseType,
} from './demographics.response';

export async function getDemographicsDetails(params: GetDemographicsInput) {
  try {
    const validated = GetDemographicsInputSchema.safeParse(params);
    if (!validated.success) {
      return createApiResponse<DemographicsDetailsResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid query parameters',
      });
    }

    const { camera_id, gender, age, emotion, ethnicity, start_date, end_date } = validated.data;

    const queryParams: Record<string, string> = {
      camera_id,
      gender: gender ?? '',
      age: age ?? '',
      emotion: emotion ?? '',
      ethnicity: ethnicity ?? '',
    };
    if (start_date) queryParams.start_date = start_date;
    if (end_date) queryParams.end_date = end_date;

    const query = new URLSearchParams(queryParams).toString();

    const res = await fetch(`${BASE_API_URL}/demographics/results?${query}`);

    if (!res.ok) {
      const err = await res.text();
      return createApiResponse<DemographicsDetailsResponseType>({
        success: false,
        message: 'API request failed',
        error: err || 'Unknown error',
      });
    }

    const json = await res.json();

    return createApiResponse<DemographicsDetailsResponseType>({
      success: true,
      message: 'Demographics details fetched successfully',
      data: json,
    });
  } catch (error) {
    const apiError = error as Error;
    return createApiResponse<DemographicsDetailsResponseType>({
      success: false,
      message: 'Unexpected error',
      error: apiError.message || 'Something went wrong',
    });
  }
}

export async function editCameraDemographicsConfig(
  config_id: string,
  params: EditCameraDemographicsConfigInput,
) {
  try {
    if (!config_id) {
      return createApiResponse<CameraDemographicsConfigResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid camera id',
      });
    }

    const validated = EditCameraDemographicsConfigSchema.safeParse(params);
    if (!validated.success) {
      return createApiResponse<CameraDemographicsConfigResponseType>({
        success: false,
        message: 'Validation failed',
        error: 'Invalid query parameters',
      });
    }

    const res = await fetch(`${BASE_API_URL}/demographics/config/${config_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.text();
      return createApiResponse<CameraDemographicsConfigResponseType>({
        success: false,
        message: 'API request failed',
        error: err || 'Unknown error',
      });
    }

    const json = await res.json();

    return createApiResponse<CameraDemographicsConfigResponseType>({
      success: true,
      message: 'Camera demographics config updated successfully',
      data: json,
    });
  } catch (error) {
    const apiError = error as Error;
    return createApiResponse<CameraDemographicsConfigResponseType>({
      success: false,
      message: 'Unexpected error',
      error: apiError.message || 'Something went wrong',
    });
  }
}
