import { render, screen } from "@testing-library/react";
import { CameraCard } from "../camera-card";
import { Camera } from "@/types";
import React from "react";

jest.mock("next/link", () => {
  const MockedLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  MockedLink.displayName = "MockedLink";
  return MockedLink;
});

describe("CameraCard", () => {
  const mockCamera: Camera = {
    id: "123",
    name: "Test Camera",
    rtsp_url: "rtsp://example.com/stream",
    stream_frame_width: 1920,
    stream_frame_height: 1080,
    stream_fps: 30,
    tags: [
      { id: "1", name: "Entrance" },
      { id: "2", name: "Indoor" },
    ],
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  it("renders camera information", () => {
    render(<CameraCard camera={mockCamera} />);

    expect(screen.getByText("Test Camera")).toBeInTheDocument();
    expect(screen.getByText("rtsp://example.com/stream")).toBeInTheDocument();
    expect(screen.getByText("1920x1080")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(<CameraCard camera={mockCamera} />);

    expect(screen.getByText("Entrance")).toBeInTheDocument();
    expect(screen.getByText("Indoor")).toBeInTheDocument();
  });

  it("shows configured status when demographics config exists", () => {
    const cameraWithConfig = {
      ...mockCamera,
      demographics_config: {
        id: "456",
        camera_id: "123",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    };

    render(<CameraCard camera={cameraWithConfig} />);
    expect(screen.getByText("Configured")).toBeInTheDocument();
  });

  it("shows not configured status when no demographics config", () => {
    render(<CameraCard camera={mockCamera} />);
    expect(screen.getByText("Not Configured")).toBeInTheDocument();
  });

  it("renders action buttons with correct links", () => {
    render(<CameraCard camera={mockCamera} />);

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute("href", "/cameras/123");

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/cameras/123/edit");

    const demographicsLink = screen.getByRole("link", {
      name: /demographics/i,
    });
    expect(demographicsLink).toHaveAttribute(
      "href",
      "/demographics?camera_id=123"
    );
  });
});
