import CamerasList from "../components/CamerasList";
import { render, screen } from "@testing-library/react";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

test("renders data from useQuery", async () => {
  render(<CamerasList />);
  expect(await screen.findByText("Highway")).toBeInTheDocument();
});
