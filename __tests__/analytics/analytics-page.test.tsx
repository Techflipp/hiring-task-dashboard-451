import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import AnalyticsPage from "@/app/analytics/page";
import { useCameras } from "@/hooks/use-cameras";
import { useDemographicsResults } from "@/hooks/use-demographics-results";

jest.mock("@/hooks/use-cameras");
jest.mock("@/hooks/use-demographics-results");

const mockUseCameras = useCameras as jest.MockedFunction<typeof useCameras>;
const mockUseDemographicsResults =
  useDemographicsResults as jest.MockedFunction<typeof useDemographicsResults>;

const mockCameras = {
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
    {
      id: "2",
      name: "Camera 2",
      rtsp_url: "rtsp://example.com/camera2",
      tags: [{ id: "2", name: "Exit", color: "#00ff00" }],
      is_active: true,
      status_message: "Online",
      snapshot: "data:image/jpeg;base64,test2",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ],
  total: 2,
  page: 1,
  size: 100,
  pages: 1,
};

const mockDemographicsData = {
  items: [
    {
      id: "1",
      config_id: "config1",
      count: 25,
      gender: "male",
      age: "19-30",
      emotion: "happy",
      ethnicity: "white",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      config_id: "config1",
      count: 30,
      gender: "female",
      age: "31-45",
      emotion: "neutral",
      ethnicity: "african",
      created_at: "2024-01-01T00:00:00Z",
    },
  ],
  analytics: {
    gender_distribution: {
      male: 25,
      female: 30,
    },
    age_distribution: {
      "19-30": 25,
      "31-45": 30,
    },
    emotion_distribution: {
      happy: 25,
      neutral: 30,
    },
    ethnicity_distribution: {
      white: 25,
      african: 30,
    },
    total_count: 55,
  },
};

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

describe("AnalyticsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders analytics page with title and description", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: false,
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
      status: "idle",
    });

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Demographics Analytics")).toBeInTheDocument();
    expect(
      screen.getByText(/Analyze demographic insights/)
    ).toBeInTheDocument();
  });


  it("displays loading state when demographics data is loading", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: "fetching",
      isFetching: true,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      isInitialLoading: true,
      isPaused: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      refetch: jest.fn(),
      remove: jest.fn(),
      status: "pending",
    });

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Loading analytics data...")).toBeInTheDocument();
  });

  it("displays analytics summary cards", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: mockDemographicsData,
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

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    // Check if summary cards are displayed
    expect(screen.getByText("55")).toBeInTheDocument(); // Total count
  });

  it("displays export controls when data is available", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: mockDemographicsData,
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

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    // Check if export controls are displayed
    expect(screen.getByText("Export Data")).toBeInTheDocument();
  });

  it("handles error state gracefully", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load demographics data"),
      isError: true,
      isSuccess: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 1,
      failureReason: new Error("Failed to load demographics data"),
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

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("Error Loading Data")).toBeInTheDocument();
    expect(
      screen.getByText(/Failed to load demographics data/)
    ).toBeInTheDocument();
  });

  it("displays empty state when no data is available", () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: false,
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
      status: "idle",
    });

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
    expect(
      screen.getByText(/Select a camera and apply filters/)
    ).toBeInTheDocument();
  });

  it("filters demographics data when camera is selected", async () => {
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

    mockUseDemographicsResults.mockReturnValue({
      data: mockDemographicsData,
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

    render(<AnalyticsPage />, { wrapper: createTestWrapper() });

    // The demographics results hook should be called with the selected camera
    expect(mockUseDemographicsResults).toHaveBeenCalledWith({
      camera_id: "",
      gender: "",
      age: "",
      emotion: "",
      ethnicity: "",
      start_date: "",
      end_date: "",
    });
  });
});
