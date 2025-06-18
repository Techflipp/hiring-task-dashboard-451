const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  url.searchParams.append("page", page.toString());
  url.searchParams.append("size", size.toString());

  if (cameraName) {
    url.searchParams.append("camera_name", cameraName);
  }

  const response = await fetch(url.toString());

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
