import axios from 'axios';

const API_BASE_URL = 'https://task-451-api.ryd.wafaicloud.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);