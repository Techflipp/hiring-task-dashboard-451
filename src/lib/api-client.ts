import { API_BASE_URL } from "./config";

interface ApiErrorData {
  detail?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiErrorData
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.detail || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  const data = await response.json();
  return data;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && response.status >= 500 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;
type RequestBody = Record<string, unknown>;

function formatQueryParams(params: QueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "object") {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams;
}

export const apiClient = {
  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);

      if (params) {
        const searchParams = formatQueryParams(params);
        url.search = searchParams.toString();
      }

      console.log("Request URL:", url.toString());

      const response = await fetchWithRetry(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error("API Get Error:", error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data?: RequestBody): Promise<T> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error("API Post Error:", error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data?: RequestBody): Promise<T> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error("API Put Error:", error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return handleResponse<T>(response);
    } catch (error) {
      console.error("API Delete Error:", error);
      throw error;
    }
  },
};
