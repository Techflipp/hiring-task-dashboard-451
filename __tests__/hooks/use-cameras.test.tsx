import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { useCameras } from "@/hooks/use-cameras";
import { api } from "@/services/api/api";

// Mock the API
jest.mock("@/services/api/api");
jest.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
  SnackbarProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockApi = api as jest.Mocked<typeof api>;

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </QueryClientProvider>
  );
};

describe("useCameras", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches cameras successfully", async () => {
    const mockCamerasData = {
      items: [
        {
          id: "1",
          name: "Camera 1",
          rtsp_url: "rtsp://example.com/camera1",
          tags: [{ id: "1", name: "Entrance", color: "#ff0000" }],
          is_active: true,
          status_message: "Online",
          snapshot: "data:image/jpeg;base64,test",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ],
      total: 1,
      page: 1,
      size: 10,
      pages: 1,
    };

    mockApi.GET.mockResolvedValue({
      data: mockCamerasData,
      error: null,
      response: {} as Response,
    });

    const { result } = renderHook(() => useCameras({ page: 1, size: 10 }), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCamerasData);
    expect(mockApi.GET).toHaveBeenCalledWith("/cameras/", {
      params: {
        query: {
          page: 1,
          size: 10,
          camera_name: undefined,
        },
      },
    });
  });

  it("handles API errors gracefully", async () => {
    const mockError = new Error("Failed to fetch cameras");
    mockApi.GET.mockResolvedValue({
      data: null,
      error: mockError,
      response: {} as Response,
    });

    const { result } = renderHook(() => useCameras({ page: 1, size: 10 }), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });

  it("includes camera name in query when provided", async () => {
    const mockCamerasData = {
      items: [],
      total: 0,
      page: 1,
      size: 10,
      pages: 0,
    };

    mockApi.GET.mockResolvedValue({
      data: mockCamerasData,
      error: null,
      response: {} as Response,
    });

    const { result } = renderHook(
      () => useCameras({ page: 1, size: 10, cameraName: "Camera 1" }),
      { wrapper: createTestWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.GET).toHaveBeenCalledWith("/cameras/", {
      params: {
        query: {
          page: 1,
          size: 10,
          camera_name: "Camera 1",
        },
      },
    });
  });

  it("updates query when parameters change", async () => {
    const mockCamerasData = {
      items: [],
      total: 0,
      page: 2,
      size: 20,
      pages: 0,
    };

    mockApi.GET.mockResolvedValue({
      data: mockCamerasData,
      error: null,
      response: {} as Response,
    });

    const { result, rerender } = renderHook(
      ({ page, size }) => useCameras({ page, size }),
      {
        wrapper: createTestWrapper(),
        initialProps: { page: 1, size: 10 },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Change parameters
    rerender({ page: 2, size: 20 });

    await waitFor(() => {
      expect(mockApi.GET).toHaveBeenCalledWith("/cameras/", {
        params: {
          query: {
            page: 2,
            size: 20,
            camera_name: undefined,
          },
        },
      });
    });
  });

  it("handles empty camera name parameter", async () => {
    const mockCamerasData = {
      items: [],
      total: 0,
      page: 1,
      size: 10,
      pages: 0,
    };

    mockApi.GET.mockResolvedValue({
      data: mockCamerasData,
      error: null,
      response: {} as Response,
    });

    const { result } = renderHook(
      () => useCameras({ page: 1, size: 10, cameraName: "" }),
      { wrapper: createTestWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.GET).toHaveBeenCalledWith("/cameras/", {
      params: {
        query: {
          page: 1,
          size: 10,
          camera_name: undefined,
        },
      },
    });
  });

  it("maintains loading state during fetch", async () => {
    // Don't resolve the promise immediately to test loading state
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockApi.GET.mockReturnValue(promise);

    const { result } = renderHook(() => useCameras({ page: 1, size: 10 }), {
      wrapper: createTestWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    // Resolve the promise
    resolvePromise!({
      data: { items: [], total: 0, page: 1, size: 10, pages: 0 },
      error: null,
      response: {} as Response,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("handles network errors", async () => {
    mockApi.GET.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCameras({ page: 1, size: 10 }), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });
});
