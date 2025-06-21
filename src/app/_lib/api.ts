interface GetCamerasParams {
  page: number;
  size: number;
  cameraName?: string;
}

const API_BASE_URL = "https://task-451-api.ryd.wafaicloud.com";

export const getCameras = async ({
  page,
  size,
  cameraName,
}: GetCamerasParams) => {
  const url = new URL(`${API_BASE_URL}/cameras/`); // Note the trailing slash
  url.searchParams.append("page", page.toString());
  url.searchParams.append("size", size.toString());

  if (cameraName) {
    url.searchParams.append("camera_name", cameraName);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Handle both response formats
    return { cameras: data?.items, total: data?.total };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
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
