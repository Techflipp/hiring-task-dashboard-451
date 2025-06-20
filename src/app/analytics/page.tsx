"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCameras } from "@/hooks/use-cameras";
import { useDemographicsResults } from "@/hooks/use-demographics-results";
import { DemographicsFilters } from "@/components/demographics-filters";
import { DemographicsChart } from "@/components/analytics/demographics-chart";
import { DemographicsTable } from "@/components/analytics/demographics-table";
import { AnalyticsSummary } from "@/components/analytics/analytics-summary";
import { ExportControls } from "@/components/analytics/export-controls";
import {
  DemographicsResultsFormData,
  demographicsResultsSchema,
} from "@/services/schema/demographics-results.schema";
import { BarChart3, Users, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const { data: camerasData } = useCameras({ page: 1, size: 100 });
  const cameras = camerasData?.items || [];

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<DemographicsResultsFormData>({
    resolver: yupResolver(demographicsResultsSchema),
    defaultValues: {
      camera_id: "",
      gender: undefined,
      age: undefined,
      emotion: undefined,
      ethnicity: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const filters = watch();
  const {
    data: demographicsData,
    isLoading,
    error,
  } = useDemographicsResults(filters);

  const onSubmit = () => {
    // Form submission is handled automatically via watch()
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold">Demographics Analytics</h1>
          </div>
          <p className="text-gray-400">
            Analyze demographic insights and visitor patterns across your camera
            network
          </p>
        </div>

        <div className="mb-8">
          <DemographicsFilters
            register={register}
            errors={errors}
            cameras={cameras}
            onSubmit={onSubmit}
            reset={reset}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading analytics data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-8">
            <h3 className="text-red-400 font-semibold mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-300">
              {error.message ||
                "Failed to load demographics data. Please try again."}
            </p>
          </div>
        )}

        {/* Analytics Content */}
        {demographicsData && !isLoading && (
          <>
            {/* Summary Cards */}
            <div className="mb-8">
              <AnalyticsSummary analytics={demographicsData.analytics} />
            </div>

            {/* Export Controls */}
            <div className="mb-8">
              <ExportControls data={demographicsData} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Gender Distribution
                </h3>
                <DemographicsChart
                  data={demographicsData.analytics.gender_distribution}
                  type="gender"
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Age Distribution</h3>
                <DemographicsChart
                  data={demographicsData.analytics.age_distribution}
                  type="age"
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Emotion Distribution
                </h3>
                <DemographicsChart
                  data={demographicsData.analytics.emotion_distribution}
                  type="emotion"
                />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Ethnicity Distribution
                </h3>
                <DemographicsChart
                  data={demographicsData.analytics.ethnicity_distribution}
                  type="ethnicity"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
              <DemographicsTable data={demographicsData.items} />
            </div>
          </>
        )}

        {/* Empty State */}
        {!demographicsData && !isLoading && !error && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-400 mb-4">
              Select a camera and apply filters to view demographics analytics.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Data will appear once you select a camera</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
