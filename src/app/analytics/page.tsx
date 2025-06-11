"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  CalendarIcon,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Users,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface DemographicsResult {
  id: string;
  camera_id: string;
  gender: string;
  age: string;
  emotion: string;
  ethnicity: string;
  timestamp: string;
}

interface Camera {
  id: string;
  name: string;
}

const COLORS = {
  male: "#3B82F6",
  female: "#EC4899",
  "0-18": "#10B981",
  "19-30": "#F59E0B",
  "31-45": "#EF4444",
  "46-60": "#8B5CF6",
  "60+": "#6B7280",
  happy: "#10B981",
  neutral: "#6B7280",
  sad: "#EF4444",
  angry: "#DC2626",
  surprise: "#F59E0B",
  fear: "#8B5CF6",
  white: "#F3F4F6",
  african: "#92400E",
  south_asian: "#059669",
  east_asian: "#DC2626",
  middle_eastern: "#7C2D12",
};

async function fetchCameras(): Promise<Camera[]> {
  const response = await fetch(
    "https://task-451-api.ryd.wafaicloud.com/cameras/?size=100"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch cameras");
  }
  const data = await response.json();
  return data.items;
}

async function fetchDemographicsResults(params: {
  camera_id?: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
}): Promise<DemographicsResult[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(
      `https://task-451-api.ryd.wafaicloud.com/demographics/results?${searchParams}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.items)) {
      return data.items;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn("Unexpected API response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching demographics results:", error);
    return [];
  }
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const [selectedCamera, setSelectedCamera] = useState(
    searchParams.get("camera_id") || ""
  );
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedEthnicity, setSelectedEthnicity] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: cameras } = useQuery({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "demographics-results",
      selectedCamera,
      selectedGender,
      selectedAge,
      selectedEmotion,
      selectedEthnicity,
      startDate,
      endDate,
    ],
    queryFn: () =>
      fetchDemographicsResults({
        camera_id: selectedCamera || undefined,
        gender: selectedGender || undefined,
        age: selectedAge || undefined,
        emotion: selectedEmotion || undefined,
        ethnicity: selectedEthnicity || undefined,
        start_date: startDate ? startDate.toISOString() : undefined,
        end_date: endDate ? endDate.toISOString() : undefined,
      }),
    enabled: !!selectedCamera,
    retry: 1,
    staleTime: 30000, // 30 seconds
  });

  const analytics = useMemo(() => {
    if (!results || !Array.isArray(results) || results.length === 0) {
      return {
        total: 0,
        genderData: [],
        ageData: [],
        emotionData: [],
        ethnicityData: [],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          count: 0,
        })),
        uniqueDays: 0,
      };
    }

    try {
      const genderData = Object.entries(
        results.reduce((acc, result) => {
          if (result?.gender) {
            acc[result.gender] = (acc[result.gender] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
        fill: COLORS[name as keyof typeof COLORS] || "#6B7280",
      }));

      const ageData = Object.entries(
        results.reduce((acc, result) => {
          if (result?.age) {
            acc[result.age] = (acc[result.age] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
        fill: COLORS[name as keyof typeof COLORS] || "#6B7280",
      }));

      const emotionData = Object.entries(
        results.reduce((acc, result) => {
          if (result?.emotion) {
            acc[result.emotion] = (acc[result.emotion] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
        fill: COLORS[name as keyof typeof COLORS] || "#6B7280",
      }));

      const ethnicityData = Object.entries(
        results.reduce((acc, result) => {
          if (result?.ethnicity) {
            acc[result.ethnicity] = (acc[result.ethnicity] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
        fill: COLORS[name as keyof typeof COLORS] || "#6B7280",
      }));

      // Time series data (hourly)
      const timeSeriesData = results.reduce((acc, result) => {
        if (result?.timestamp) {
          try {
            const hour = new Date(result.timestamp).getHours();
            const key = `${hour}:00`;
            acc[key] = (acc[key] || 0) + 1;
          } catch (e) {
            // Invalid timestamp, skip
          }
        }
        return acc;
      }, {} as Record<string, number>);

      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        count: timeSeriesData[`${i}:00`] || 0,
      }));

      const uniqueDays = new Set(
        results
          .map((r) => {
            try {
              return r?.timestamp ? new Date(r.timestamp).toDateString() : null;
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean)
      ).size;

      return {
        total: results.length,
        genderData,
        ageData,
        emotionData,
        ethnicityData,
        hourlyData,
        uniqueDays,
      };
    } catch (error) {
      console.error("Error processing analytics data:", error);
      return {
        total: 0,
        genderData: [],
        ageData: [],
        emotionData: [],
        ethnicityData: [],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          count: 0,
        })),
        uniqueDays: 0,
      };
    }
  }, [results]);

  const clearFilters = () => {
    setSelectedGender("");
    setSelectedAge("");
    setSelectedEmotion("");
    setSelectedEthnicity("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Demographics Analytics
            </h1>
            <p className="text-muted-foreground">
              Analyze demographic data from your camera network
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Camera</label>
                <Select
                  value={selectedCamera}
                  onValueChange={setSelectedCamera}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras?.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id}>
                        {camera.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={selectedGender}
                  onValueChange={setSelectedGender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age Group</label>
                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="All ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-18">0-18</SelectItem>
                    <SelectItem value="19-30">19-30</SelectItem>
                    <SelectItem value="31-45">31-45</SelectItem>
                    <SelectItem value="46-60">46-60</SelectItem>
                    <SelectItem value="60+">60+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emotion</label>
                <Select
                  value={selectedEmotion}
                  onValueChange={setSelectedEmotion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All emotions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="angry">Angry</SelectItem>
                    <SelectItem value="surprise">Surprise</SelectItem>
                    <SelectItem value="fear">Fear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ethnicity</label>
                <Select
                  value={selectedEthnicity}
                  onValueChange={setSelectedEthnicity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All ethnicities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="african">African</SelectItem>
                    <SelectItem value="south_asian">South Asian</SelectItem>
                    <SelectItem value="east_asian">East Asian</SelectItem>
                    <SelectItem value="middle_eastern">
                      Middle Eastern
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: startDate, to: endDate }}
                        onSelect={(range) => {
                          setStartDate(range?.from);
                          setEndDate(range?.to);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedGender && (
                <Badge variant="secondary">
                  Gender: {selectedGender}
                  <button
                    onClick={() => setSelectedGender("")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedAge && (
                <Badge variant="secondary">
                  Age: {selectedAge}
                  <button
                    onClick={() => setSelectedAge("")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedEmotion && (
                <Badge variant="secondary">
                  Emotion: {selectedEmotion}
                  <button
                    onClick={() => setSelectedEmotion("")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedEthnicity && (
                <Badge variant="secondary">
                  Ethnicity: {selectedEthnicity}
                  <button
                    onClick={() => setSelectedEthnicity("")}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {(startDate || endDate) && (
                <Badge variant="secondary">
                  Date: {startDate ? format(startDate, "MMM dd") : "..."} -{" "}
                  {endDate ? format(endDate, "MMM dd") : "..."}
                  <button
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {!selectedCamera && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Camera</h3>
                <p className="text-muted-foreground">
                  Choose a camera from the filter above to view demographics
                  analytics
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCamera && (
          <>
            {/* Stats Overview */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Detections"
                  value={analytics.total.toLocaleString()}
                  icon={Users}
                  trend="All time"
                />
                <StatCard
                  title="Unique Days"
                  value={analytics.uniqueDays}
                  icon={TrendingUp}
                  trend="With activity"
                />
                <StatCard
                  title="Avg per Day"
                  value={
                    analytics.uniqueDays > 0
                      ? Math.round(analytics.total / analytics.uniqueDays)
                      : 0
                  }
                  icon={BarChart3}
                  trend="Detections"
                />
                <StatCard
                  title="Peak Hour"
                  value={
                    analytics.hourlyData.reduce(
                      (max, curr) => (curr.count > max.count ? curr : max),
                      {
                        hour: "0:00",
                        count: 0,
                      }
                    ).hour
                  }
                  icon={PieChart}
                  trend="Most active"
                />
              </div>
            )}

            {/* Charts */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-64 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                {/* Time Series Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity by Hour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: {
                          label: "Detections",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-64"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.hourlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Demographics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gender Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Count",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <RechartsPieChart
                              data={analytics.genderData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                            >
                              {analytics.genderData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </RechartsPieChart>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Age Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Count",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.ageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="hsl(var(--chart-2))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Emotion Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Emotion Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Count",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.emotionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="hsl(var(--chart-3))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  {/* Ethnicity Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ethnicity Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: {
                            label: "Count",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.ethnicityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="hsl(var(--chart-4))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Data Available
                    </h3>
                    <p className="text-muted-foreground">
                      No demographics data found for the selected filters
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
