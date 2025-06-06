import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";
import {
  DemographicsConfig,
  DemographicsConfigCreatePayload,
  DemographicsConfigUpdatePayload,
  DemographicsResponse,
  DemographicsResultsParams,
} from "@/types";

export const demographicsService = {
  async createConfig(
    data: DemographicsConfigCreatePayload
  ): Promise<DemographicsConfig> {
    return apiClient.post<DemographicsConfig>(
      API_ENDPOINTS.demographics.config,
      data
    );
  },

  async updateConfig(
    id: string,
    data: DemographicsConfigUpdatePayload
  ): Promise<DemographicsConfig> {
    return apiClient.put<DemographicsConfig>(
      `${API_ENDPOINTS.demographics.config}/${id}`,
      data
    );
  },

  async getResults(
    params: DemographicsResultsParams
  ): Promise<DemographicsResponse> {
    try {
      // Clean up params by removing undefined values
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      return await apiClient.get<DemographicsResponse>(
        API_ENDPOINTS.demographics.results,
        cleanParams
      );
    } catch (error) {
      console.error("Demographics Service Error:", error);
      throw error;
    }
  },
};
