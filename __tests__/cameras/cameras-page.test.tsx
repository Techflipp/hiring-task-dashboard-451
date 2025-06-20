import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import CameraListPage from "@/app/cameras/page";
import { useCameras } from "@/hooks/use-cameras";

jest.mock("@/hooks/use-cameras");

const mockUseCameras = useCameras as jest.MockedFunction<typeof useCameras>;

const mockCameras = {
  items: [
    {
      id: "1",
      name: "Camera 1",
      rtsp_url: "rtsp://example.com/camera1",
      tags: [
        { id: "1", name: "Entrance", color: "#ff0000" },
        { id: "2", name: "Security", color: "#00ff00" },
      ],
      is_active: true,
      status_message: "Online",
      snapshot: "data:image/jpeg;base64,test",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Camera 2",
      rtsp_url: "rtsp://example.com/camera2",
      tags: [{ id: "3", name: "Exit", color: "#0000ff" }],
      is_active: false,
      status_message: "Offline",
      snapshot: "data:image/jpeg;base64,test2",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ],
  total: 2,
  page: 1,
  size: 10,
  pages: 1,
};

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </QueryClientProvider>
  );
  TestWrapper.displayName = "TestWrapper";
  return TestWrapper;
};

describe("CameraListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders camera list page with title", () => {
    mockUseCameras.mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Cameras")).toBeInTheDocument();
  });


  it("filters cameras when search query is entered", async () => {
    const mockRefetch = jest.fn();
    mockUseCameras.mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: mockRefetch,
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    const searchInput = screen.getByPlaceholderText("Search cameras...");
    fireEvent.change(searchInput, { target: { value: "Camera 1" } });

    await waitFor(() => {
      expect(mockUseCameras).toHaveBeenCalledWith({
        page: 1,
        size: 10,
        cameraName: "Camera 1",
      });
    });
  });

  it("changes page size when dropdown is selected", async () => {
    mockUseCameras.mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    const pageSizeSelect = screen.getByDisplayValue("10 per page");
    fireEvent.change(pageSizeSelect, { target: { value: "20" } });

    await waitFor(() => {
      expect(mockUseCameras).toHaveBeenCalledWith({
        page: 1,
        size: 20,
        cameraName: "",
      });
    });
  });

  it("handles pagination correctly", async () => {
    const mockCamerasWithPagination = {
      ...mockCameras,
      page: 1,
      pages: 3,
    };

    mockUseCameras.mockReturnValue({
      data: mockCamerasWithPagination,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: true,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    expect(nextButton).not.toBeDisabled();

    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("displays camera tags correctly", () => {
    mockUseCameras.mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Entrance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Exit")).toBeInTheDocument();
  });

  it("handles error state gracefully", () => {
    mockUseCameras.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch cameras"),
      isError: true,
      isSuccess: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 1,
      failureReason: new Error("Failed to fetch cameras"),
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "error",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });
  });

  it("navigates to camera detail page when camera card is clicked", () => {
    mockUseCameras.mockReturnValue({
      data: mockCameras,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "idle",
      isFetching: false,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "success",
    });

    render(<CameraListPage />, { wrapper: createTestWrapper() });

    const cameraLink = screen.getByRole("link", { name: /camera 1/i });
    expect(cameraLink).toHaveAttribute("href", "/cameras/1");
  });
});
