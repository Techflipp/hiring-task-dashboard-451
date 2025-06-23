"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Filter, PieChart, BarChart } from "lucide-react";
import { getDemographicsResults } from "@/lib/api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DemographicsAnalyticsProps {
  cameraId: string;
}

interface DemographicsResponse {
  items: Array<{
    id: string;
    camera_id: string;
    gender: string;
    age: string;
    emotion: string;
    ethnicity: string;
    timestamp: string;
    confidence: number;
    count: number;
  }>;
  analytics: {
    gender_distribution: Record<string, number>;
    age_distribution: Record<string, number>;
    emotion_distribution: Record<string, number>;
    ethnicity_distribution: Record<string, number>;
    total_count: number;
  };
}

export default function DemographicsAnalytics({
  cameraId,
}: DemographicsAnalyticsProps) {
  const [data, setData] = useState<DemographicsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    age: "",
    emotion: "",
    ethnicity: "",
    start_date: "",
    end_date: "",
  });

  const genders = ["male", "female"];
  const ages = ["0-18", "19-30", "31-45", "46-60", "60+"];
  const emotions = ["angry", "fear", "happy", "neutral", "sad", "surprise"];
  const ethnicities = [
    "white",
    "african",
    "south_asian",
    "east_asian",
    "middle_eastern",
  ];

  useEffect(() => {
    fetchResults();
  }, [cameraId, filters]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await getDemographicsResults({
        camera_id: cameraId,
        ...filters,
      });
      setData(response);
    } catch (error) {
      console.error("Failed to fetch demographics results:", error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (
    distribution: Record<string, number>,
    title: string
  ) => {
    const labels = Object.keys(distribution).map((key) =>
      key
        .replace("_", " ")
        .replace("south asian", "South Asian")
        .replace("east asian", "East Asian")
        .replace("middle eastern", "Middle Eastern")
    );
    const values = Object.values(distribution);
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: backgroundColors.slice(0, values.length),
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={filters.gender}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    gender: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Age Group</Label>
              <Select
                value={filters.age}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    age: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ages</SelectItem>
                  {ages.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Emotion</Label>
              <Select
                value={filters.emotion}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    emotion: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All emotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All emotions</SelectItem>
                  {emotions.map((emotion) => (
                    <SelectItem key={emotion} value={emotion}>
                      {emotion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ethnicity</Label>
              <Select
                value={filters.ethnicity}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    ethnicity: value === "all" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All ethnicities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ethnicities</SelectItem>
                  {ethnicities.map((ethnicity) => (
                    <SelectItem key={ethnicity} value={ethnicity}>
                      {ethnicity.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="datetime-local"
                value={filters.start_date}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="datetime-local"
                value={filters.end_date}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, end_date: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Gender Distribution</h3>
                  <div className="h-64">
                    <Pie
                      data={prepareChartData(
                        data.analytics.gender_distribution,
                        "Gender"
                      )}
                      options={chartOptions}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Age Distribution</h3>
                  <div className="h-64">
                    <Bar
                      data={prepareChartData(
                        data.analytics.age_distribution,
                        "Age"
                      )}
                      options={chartOptions}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Emotion Distribution</h3>
                  <div className="h-64">
                    <Pie
                      data={prepareChartData(
                        data.analytics.emotion_distribution,
                        "Emotion"
                      )}
                      options={chartOptions}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Ethnicity Distribution</h3>
                  <div className="h-64">
                    <Bar
                      data={prepareChartData(
                        data.analytics.ethnicity_distribution,
                        "Ethnicity"
                      )}
                      options={chartOptions}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Detections ({data.analytics.total_count} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">Gender</th>
                      <th className="text-left p-2">Age</th>
                      <th className="text-left p-2">Emotion</th>
                      <th className="text-left p-2">Ethnicity</th>
                      <th className="text-left p-2">Count</th>
                      <th className="text-left p-2">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.slice(0, 10).map((result) => (
                      <tr key={result.id} className="border-b">
                        <td className="p-2">
                          {new Date(result.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="capitalize">
                            {result.gender}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{result.age}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="capitalize">
                            {result.emotion}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="capitalize">
                            {result.ethnicity.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-2">{result.count}</td>
                        <td className="p-2">
                          {(result.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                No demographics data found for the selected filters
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
