import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDemographicsResults } from "@/hooks/use-demographics-results";
import { api } from "@/services/api/api";

jest.mock("@/services/api/api");

const mockApi = api as jest.Mocked<typeof api>;

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = "TestWrapper";
  return TestWrapper;
};

describe("useDemographicsResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches demographics results successfully", async () => {
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
      ],
      analytics: {
        gender_distribution: { male: 25 },
        age_distribution: { "19-30": 25 },
        emotion_distribution: { happy: 25 },
        ethnicity_distribution: { white: 25 },
        total_count: 25,
      },
    };

    mockApi.GET.mockResolvedValue({
      data: mockDemographicsData,
      error: null,
      response: {} as Response,
    });

    const filters = { camera_id: "1" };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDemographicsData);
    expect(mockApi.GET).toHaveBeenCalledWith("/demographics/results", {
      params: {
        query: filters,
      },
    });
  });

  it("handles API errors gracefully", async () => {
    const mockError = new Error("Failed to fetch demographics data");
    mockApi.GET.mockResolvedValue({
      data: null,
      error: mockError,
      response: {} as Response,
    });

    const filters = { camera_id: "1" };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });

  it("includes all filter parameters in query", async () => {
    const mockDemographicsData = {
      items: [],
      analytics: {
        gender_distribution: {},
        age_distribution: {},
        emotion_distribution: {},
        ethnicity_distribution: {},
        total_count: 0,
      },
    };

    mockApi.GET.mockResolvedValue({
      data: mockDemographicsData,
      error: null,
      response: {} as Response,
    });

    const filters = {
      camera_id: "1",
      gender: "male",
      age: "19-30",
      emotion: "happy",
      ethnicity: "white",
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.GET).toHaveBeenCalledWith("/demographics/results", {
      params: {
        query: filters,
      },
    });
  });

  it("does not fetch when camera_id is not provided", async () => {
    const filters = { camera_id: "" };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    expect(result.current.isSuccess).toBe(false);
    expect(mockApi.GET).not.toHaveBeenCalled();
  });

  it("updates query when filters change", async () => {
    const mockDemographicsData = {
      items: [],
      analytics: {
        gender_distribution: {},
        age_distribution: {},
        emotion_distribution: {},
        ethnicity_distribution: {},
        total_count: 0,
      },
    };

    mockApi.GET.mockResolvedValue({
      data: mockDemographicsData,
      error: null,
      response: {} as Response,
    });

    const { result, rerender } = renderHook(
      ({ filters }) => useDemographicsResults(filters),
      {
        wrapper: createTestWrapper(),
        initialProps: { filters: { camera_id: "1" } },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    rerender({ filters: { camera_id: "1", gender: "male" } });

    await waitFor(() => {
      expect(mockApi.GET).toHaveBeenCalledWith("/demographics/results", {
        params: {
          query: { camera_id: "1", gender: "male" },
        },
      });
    });
  });

  it("handles empty filter values", async () => {
    const mockDemographicsData = {
      items: [],
      analytics: {
        gender_distribution: {},
        age_distribution: {},
        emotion_distribution: {},
        ethnicity_distribution: {},
        total_count: 0,
      },
    };

    mockApi.GET.mockResolvedValue({
      data: mockDemographicsData,
      error: null,
      response: {} as Response,
    });

    const filters = {
      camera_id: "1",
      gender: "",
      age: "",
      emotion: "",
      ethnicity: "",
      start_date: "",
      end_date: "",
    };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.GET).toHaveBeenCalledWith("/demographics/results", {
      params: {
        query: filters,
      },
    });
  });

  it("maintains loading state during fetch", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockApi.GET.mockReturnValue(promise);

    const filters = { camera_id: "1" };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);

    // Resolve the promise
    resolvePromise!({
      data: {
        items: [],
        analytics: {
          gender_distribution: {},
          age_distribution: {},
          emotion_distribution: {},
          ethnicity_distribution: {},
          total_count: 0,
        },
      },
      error: null,
      response: {} as Response,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("handles network errors", async () => {
    mockApi.GET.mockRejectedValue(new Error("Network error"));

    const filters = { camera_id: "1" };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });

  it("handles null filter values", async () => {
    const mockDemographicsData = {
      items: [],
      analytics: {
        gender_distribution: {},
        age_distribution: {},
        emotion_distribution: {},
        ethnicity_distribution: {},
        total_count: 0,
      },
    };

    mockApi.GET.mockResolvedValue({
      data: mockDemographicsData,
      error: null,
      response: {} as Response,
    });

    const filters = {
      camera_id: "1",
      gender: null,
      age: null,
      emotion: null,
      ethnicity: null,
      start_date: null,
      end_date: null,
    };

    const { result } = renderHook(() => useDemographicsResults(filters), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.GET).toHaveBeenCalledWith("/demographics/results", {
      params: {
        query: filters,
      },
    });
  });
});
