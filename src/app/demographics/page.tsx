"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useDemographicsResults } from "@/hooks/use-demographics";
import { DemographicsFilters } from "@/components/demographics/demographics-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/charts/pie-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Brain, Globe } from "lucide-react";
import {
  aggregateDemographicsData,
  prepareChartData,
  prepareTimeSeriesData,
  calculateAverageConfidence,
} from "@/utils/analytics";
import { DemographicsResultsParams } from "@/types";
import { CameraSelector } from "@/components/demographics/camera-selector";

export default function DemographicsPage() {
  const searchParams = useSearchParams();
  const cameraId = searchParams.get("camera_id") || "";

  const [filters, setFilters] = useState<
    Omit<DemographicsResultsParams, "camera_id">
  >({});

  const queryParams: DemographicsResultsParams = {
    camera_id: cameraId,
    ...filters,
  };

  const { data, isLoading, error } = useDemographicsResults(queryParams);

  const items = useMemo(() => data?.items || [], [data?.items]);
  const analyticsData = useMemo(() => data?.analytics, [data?.analytics]);

  const analytics = useMemo(() => {
    if (!analyticsData) return null;
    return aggregateDemographicsData(analyticsData);
  }, [analyticsData]);
  const chartData = useMemo(() => {
    if (!analyticsData) return null;

    return {
      gender: prepareChartData(
        analyticsData.gender_distribution,
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      ),
      age: prepareChartData(analyticsData.age_distribution),
      emotion: prepareChartData(
        analyticsData.emotion_distribution,
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      ),
      ethnicity: prepareChartData(analyticsData.ethnicity_distribution, (key) =>
        key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      ),
    };
  }, [analyticsData]);

  const timeSeriesData = useMemo(() => {
    return prepareTimeSeriesData(items);
  }, [items]);

  const avgConfidence = useMemo(() => {
    return calculateAverageConfidence(items);
  }, [items]);

  if (!cameraId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Please select a camera to view demographics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Demographics Analytics
        </h1>
        <p className="text-gray-600">
          Analyze demographic data collected by your cameras
        </p>
      </div>
      <div className="mb-6">
        <CameraSelector />
      </div>
      <div className="space-y-6">
        <DemographicsFilters
          onFilterChange={setFilters}
          defaultValues={filters}
        />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error loading data: {error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analytics ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Detections
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics ? analytics.total.toLocaleString() : 0}{" "}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Confidence
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgConfidence}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Common Emotion
                  </CardTitle>
                  <Brain className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chartData?.emotion.sort((a, b) => b.value - a.value)[0]
                      ?.name || "N/A"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Diversity Score
                  </CardTitle>
                  <Globe className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics
                      ? Object.values(analytics.ethnicity).filter((v) => v > 0)
                          .length
                      : 0}{" "}
                    groups groups
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.gender && chartData.gender.length > 0 ? (
                    <PieChart data={chartData.gender} />
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.age && chartData.age.length > 0 ? (
                    <BarChart data={chartData.age} color="#10B981" />
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emotion Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.emotion && chartData.emotion.length > 0 ? (
                    <BarChart data={chartData.emotion} color="#F59E0B" />
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ethnicity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData?.ethnicity && chartData.ethnicity.length > 0 ? (
                    <PieChart
                      data={chartData.ethnicity}
                      colors={[
                        "#3B82F6",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                      ]}
                    />
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {timeSeriesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detections Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={timeSeriesData}
                    lines={[
                      { dataKey: "total", color: "#3B82F6", name: "Total" },
                      { dataKey: "male", color: "#10B981", name: "Male" },
                      { dataKey: "female", color: "#EC4899", name: "Female" },
                    ]}
                    height={400}
                  />
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No demographic data available for the selected filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
