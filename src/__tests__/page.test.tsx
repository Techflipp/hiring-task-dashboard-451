import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

describe("Page", () => {
  it("renders a heading", () => {
    const mockSearchParams = {
      search: "highway",
      size: "10",
      page: "1",
    };

    render(<Page searchParams={Promise.resolve(mockSearchParams)} />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(screen.getByText("Query: highway")).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });
});
