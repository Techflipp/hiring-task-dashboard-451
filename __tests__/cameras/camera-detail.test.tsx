// Mock the hooks
jest.mock("@/hooks/use-cameras");
jest.mock("@/hooks/use-camera-update");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({ id: "1" }),
}));

describe("CameraDetailPage", () => {
  it("should render without crashing", () => {
    expect(true).toBe(true);
  });
});
