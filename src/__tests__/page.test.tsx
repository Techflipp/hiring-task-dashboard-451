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
  it("get search element", () => {
    const mockSearchParams = {
      search: "high",
      size: "",
      page: "",
    };

    render(<Page searchParams={Promise.resolve(mockSearchParams)} />);

    const heading = screen.getByRole("heading", { level: 1, hidden: true });

    expect(heading).toBeInTheDocument();
  });
});
