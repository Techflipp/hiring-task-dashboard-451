"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { cameraApi, demographicsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Filter, Download, Loader2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    camera_id: searchParams.get("camera_id") || "",
    gender: "",
    age: "",
    emotion: "",
    ethnicity: "",
    start_date: "",
    end_date: "",
  });

  const { data: cameras } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => cameraApi.getCameras({ page: 1, size: 100 }),
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["demographics-results", filters],
    queryFn: () => demographicsApi.getResults(filters),
    enabled: !!filters.camera_id,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      camera_id: "",
      gender: "",
      age: "",
      emotion: "",
      ethnicity: "",
      start_date: "",
      end_date: "",
    });
  };

  // Process data for charts
  const genderData =
    results?.reduce((acc, result) => {
      acc[result.gender] = (acc[result.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const ageData =
    results?.reduce((acc, result) => {
      acc[result.age] = (acc[result.age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const emotionData =
    results?.reduce((acc, result) => {
      acc[result.emotion] = (acc[result.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const ethnicityData =
    results?.reduce((acc, result) => {
      acc[result.ethnicity] = (acc[result.ethnicity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const chartData = {
    gender: Object.entries(genderData).map(([name, value]) => ({
      name,
      value,
    })),
    age: Object.entries(ageData).map(([name, value]) => ({ name, value })),
    emotion: Object.entries(emotionData).map(([name, value]) => ({
      name,
      value,
    })),
    ethnicity: Object.entries(ethnicityData).map(([name, value]) => ({
      name,
      value,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Demographics Analytics
          </h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="camera">Camera</Label>
                <Select
                  id="camera"
                  value={filters.camera_id}
                  onChange={(e) =>
                    handleFilterChange("camera_id", e.target.value)
                  }>
                  <option value="">All Cameras</option>
                  {cameras?.items.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  id="gender"
                  value={filters.gender}
                  onChange={(e) =>
                    handleFilterChange("gender", e.target.value)
                  }>
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age Group</Label>
                <Select
                  id="age"
                  value={filters.age}
                  onChange={(e) => handleFilterChange("age", e.target.value)}>
                  <option value="">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-30">19-30</option>
                  <option value="31-45">31-45</option>
                  <option value="46-60">46-60</option>
                  <option value="60+">60+</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emotion">Emotion</Label>
                <Select
                  id="emotion"
                  value={filters.emotion}
                  onChange={(e) =>
                    handleFilterChange("emotion", e.target.value)
                  }>
                  <option value="">All Emotions</option>
                  <option value="angry">Angry</option>
                  <option value="fear">Fear</option>
                  <option value="happy">Happy</option>
                  <option value="neutral">Neutral</option>
                  <option value="sad">Sad</option>
                  <option value="surprise">Surprise</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Select
                  id="ethnicity"
                  value={filters.ethnicity}
                  onChange={(e) =>
                    handleFilterChange("ethnicity", e.target.value)
                  }>
                  <option value="">All Ethnicities</option>
                  <option value="white">White</option>
                  <option value="african">African</option>
                  <option value="south_asian">South Asian</option>
                  <option value="east_asian">East Asian</option>
                  <option value="middle_eastern">Middle Eastern</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={filters.start_date}
                  onChange={(e) =>
                    handleFilterChange("start_date", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={filters.end_date}
                  onChange={(e) =>
                    handleFilterChange("end_date", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.gender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {chartData.gender.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.age}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Emotion Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.emotion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {chartData.emotion.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ethnicity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Ethnicity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.ethnicity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <p>
                  No data available. Please select a camera and apply filters.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      }>
      <AnalyticsContent />
    </Suspense>
  );
}
