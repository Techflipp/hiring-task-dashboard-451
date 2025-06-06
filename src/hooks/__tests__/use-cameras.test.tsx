import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCameras, useCamera } from "../use-cameras";
import { camerasService } from "@/services";

jest.mock("@/services", () => ({
  camerasService: {
    getCameras: jest.fn(),
    getCameraById: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = "TestWrapper";

  return TestWrapper;
};

describe("useCameras", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches cameras successfully", async () => {
    const mockData = {
      items: [
        { id: "1", name: "Camera 1" },
        { id: "2", name: "Camera 2" },
      ],
      total: 2,
      page: 1,
      size: 20,
      pages: 1,
    };

    (camerasService.getCameras as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCameras(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("passes query parameters correctly", async () => {
    const params = { page: 2, size: 10, camera_name: "test" };

    renderHook(() => useCameras(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(camerasService.getCameras).toHaveBeenCalledWith(params);
    });
  });
});

describe("useCamera", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches camera by ID", async () => {
    const mockCamera = {
      id: "123",
      name: "Test Camera",
      rtsp_url: "rtsp://example.com",
    };

    (camerasService.getCameraById as jest.Mock).mockResolvedValue(mockCamera);

    const { result } = renderHook(() => useCamera("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCamera);
    expect(camerasService.getCameraById).toHaveBeenCalledWith("123");
  });

  it("does not fetch when ID is empty", () => {
    const { result } = renderHook(() => useCamera(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(camerasService.getCameraById).not.toHaveBeenCalled();
  });
});
