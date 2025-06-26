"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Analytics, Emotion, Ethnicity } from "@/types/camera";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsProps {
  analytics: Analytics;
  filteredData: {
    age_distribution: Record<string, number>;
    emotion_distribution: Record<string, number>;
    ethnicity_distribution: Record<string, number>;
  };
}

const Charts = ({ analytics, filteredData }: ChartsProps) => {
  // Age distribution chart
  const ageChartData = {
    labels: Object.keys(analytics.age_distribution),
    datasets: [
      {
        label: "Overall Age Distribution",
        data: Object.values(analytics.age_distribution),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Filtered Age Distribution",
        data: Object.keys(analytics.age_distribution).map(
          (age) => filteredData.age_distribution[age] || 0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Emotion distribution chart
  const emotionChartData = {
    labels: Object.keys(analytics.emotion_distribution).map((emotion) => {
      return Emotion[emotion as keyof typeof Emotion];
    }),
    datasets: [
      {
        label: "Emotion Distribution",
        data: Object.values(filteredData.emotion_distribution),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Ethnicity distribution chart
  const ethnicityChartData = {
    labels: Object.keys(analytics.ethnicity_distribution).map((ethnicity) => {
      return Ethnicity[ethnicity as keyof typeof Ethnicity];
    }),
    datasets: [
      {
        label: "Ethnicity Distribution",
        data: Object.values(filteredData.ethnicity_distribution),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
        <Bar
          data={ageChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Age Distribution Comparison",
              },
            },
          }}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Emotion Distribution</h3>
        <Pie
          data={emotionChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "right" as const,
              },
            },
          }}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Ethnicity Distribution</h3>
        <div className="h-64">
          <Bar
            data={{
              labels: ethnicityChartData.labels,
              datasets: ethnicityChartData.datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top" as const,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Charts;
