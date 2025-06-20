const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com";

interface GetCamerasParams {
  page: number;
  size: number;
  cameraName?: string;
}

export const getCameras = async ({
  page,
  size,
  cameraName,
}: GetCamerasParams) => {
  const url = new URL(`${API_BASE_URL}/cameras/`);
  console.log('url:', url)
  url.searchParams.append("page", page.toString());
  url.searchParams.append("size", size.toString());

  if (cameraName) {
    url.searchParams.append("camera_name", cameraName);
  }

  const response = await fetch(url.toString());
  console.log('response:', response)

  if (!response.ok) {
    throw new Error("Failed to fetch cameras");
  }

  return response.json();
};

export const getCameraById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/cameras/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch camera");
  }

  return response.json();
};

// Other API functions...
