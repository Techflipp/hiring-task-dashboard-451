"use client";

import { DemographicsResult } from "@/app/_lib/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsChartProps {
  data: DemographicsResult[];
}

export function ResultsChart({ data }: ResultsChartProps) {
  // Process data for chart
  const ageGroups = ["0-18", "19-30", "31-45", "46-60", "60+"];
  const genderCounts = {
    male: ageGroups.map(
      (age) => data.filter((d) => d.age === age && d.gender === "male").length
    ),
    female: ageGroups.map(
      (age) => data.filter((d) => d.age === age && d.gender === "female").length
    ),
  };

  const chartData = {
    labels: ageGroups,
    datasets: [
      {
        label: "Male",
        data: genderCounts.male,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Female",
        data: genderCounts.female,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Demographics Distribution</h2>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Count",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Age Group",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
