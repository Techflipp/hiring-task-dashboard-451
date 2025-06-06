import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination controls", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText("Previous").closest("button")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    expect(screen.getByText("Next").closest("button")).toBeDisabled();
  });

  it("calls onPageChange when clicking page number", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByText("3"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange when clicking next", async () => {
    const user = userEvent.setup();
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByText("Next"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it("highlights current page", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const page3Button = screen.getByText("3").closest("button");
    expect(page3Button).toHaveClass("bg-blue-600");
  });
});
