import { render, screen } from "@testing-library/react";
import { AnalyticsSummary } from "@/components/analytics/analytics-summary";

describe("AnalyticsSummary", () => {
  const mockAnalytics = {
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
  };

  it("renders analytics summary with correct data", () => {
    render(<AnalyticsSummary analytics={mockAnalytics} />);
    expect(screen.getByText("Total Visitors")).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument();
  });

  it("displays gender distribution summary", () => {
    render(<AnalyticsSummary analytics={mockAnalytics} />);
    expect(screen.getByText("Gender Distribution")).toBeInTheDocument();
    expect(screen.getByText("2 categories")).toBeInTheDocument();
  });

  it("displays age distribution summary", () => {
    render(<AnalyticsSummary analytics={mockAnalytics} />);
    expect(screen.getByText("Age Groups")).toBeInTheDocument();
    expect(screen.getByText("2 ranges")).toBeInTheDocument();
  });

  it("displays emotion distribution summary", () => {
    render(<AnalyticsSummary analytics={mockAnalytics} />);
    expect(screen.getByText("Emotion Types")).toBeInTheDocument();
    expect(screen.getByText("2 emotions")).toBeInTheDocument();
  });

});
