export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

export const ENDPOINTS = {
  getTags: `${API_BASE_URL}/tags/`,
  getCameras: `${API_BASE_URL}/cameras/`,
  getCamera: (id: string) => `${API_BASE_URL}/cameras/${id}/`,
  updateCamera: (id: string) => `${API_BASE_URL}/cameras/${id}/`,
  getDemographics: `${API_BASE_URL}/demographics/config/`,
  createDemographics: `${API_BASE_URL}/demographics/config/`,
  updateDemographics: (id: string) =>
    `${API_BASE_URL}/demographics/config/${id}/`,
  getDemographicsResult: `${API_BASE_URL}/demographics/results/`,
};
