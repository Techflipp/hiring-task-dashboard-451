'use client';

import { DemographicsResult } from '../../lib/types';
import { Card } from '../ui/card';
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useMemo } from 'react';

interface AnalyticsChartsProps {
  data: DemographicsResult[];
  analyticsData?: {
    gender_distribution: Record<string, number>;
    age_distribution: Record<string, number>;
    emotion_distribution: Record<string, number>;
    ethnicity_distribution: Record<string, number>;
    total_count: number;
  };
}

const COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'],
  gender: ['#3B82F6', '#EC4899'],
  age: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'],
  emotion: ['#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6', '#8B5CF6'],
  ethnicity: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
};

export function AnalyticsCharts({ data, analyticsData }: AnalyticsChartsProps) {
  const chartData = useMemo(() => {
    // If we have analytics data from API, use it directly (more efficient)
    if (analyticsData) {
      return {
        gender: Object.entries(analyticsData.gender_distribution).map(([name, value]) => ({ name, value })),
        age: Object.entries(analyticsData.age_distribution).map(([name, value]) => ({ name, value })),
        emotion: Object.entries(analyticsData.emotion_distribution).map(([name, value]) => ({ name, value })),
        ethnicity: Object.entries(analyticsData.ethnicity_distribution).map(([name, value]) => ({ name, value })),
        timeSeries: [], // We'll calculate this from individual items if needed
      };
    }

    // Fallback: calculate from individual items if no analytics data
    if (!Array.isArray(data) || data.length === 0) {
      return {
        gender: [],
        age: [],
        emotion: [],
        ethnicity: [],
        timeSeries: [],
      };
    }

    // Aggregate data by summing the count field for each category
    const genderData = data.reduce((acc, item) => {
      if (item && item.gender) {
        acc[item.gender] = (acc[item.gender] || 0) + (item.count || 1);
      }
      return acc;
    }, {} as Record<string, number>);

    const ageData = data.reduce((acc, item) => {
      if (item && item.age) {
        acc[item.age] = (acc[item.age] || 0) + (item.count || 1);
      }
      return acc;
    }, {} as Record<string, number>);

    const emotionData = data.reduce((acc, item) => {
      if (item && item.emotion) {
        acc[item.emotion] = (acc[item.emotion] || 0) + (item.count || 1);
      }
      return acc;
    }, {} as Record<string, number>);

    const ethnicityData = data.reduce((acc, item) => {
      if (item && item.ethnicity) {
        acc[item.ethnicity] = (acc[item.ethnicity] || 0) + (item.count || 1);
      }
      return acc;
    }, {} as Record<string, number>);

    // Time series data (by day from created_at)
    const timeSeriesData = data.reduce((acc, item) => {
      if (item && item.created_at) {
        const date = new Date(item.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
        acc[date] = (acc[date] || 0) + (item.count || 1);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      gender: Object.entries(genderData).map(([name, value]) => ({ name, value })),
      age: Object.entries(ageData).map(([name, value]) => ({ name, value })),
      emotion: Object.entries(emotionData).map(([name, value]) => ({ name, value })),
      ethnicity: Object.entries(ethnicityData).map(([name, value]) => ({ name, value })),
      timeSeries: Object.entries(timeSeriesData)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }, [data, analyticsData]);

  // Early return if no data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No data available for analytics</p>
      </Card>
    );
  }

  // Calculate total count from analytics or sum from data
  const totalCount = analyticsData?.total_count || data.reduce((sum, item) => sum + (item.count || 1), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Total Detections</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Most Common Gender</h3>
          <p className="text-3xl font-bold text-purple-600 capitalize">
            {chartData.gender.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Most Common Age</h3>
          <p className="text-3xl font-bold text-orange-600">
            {chartData.age.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">Most Common Emotion</h3>
          <p className="text-3xl font-bold text-green-600 capitalize">
            {chartData.emotion.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        {chartData.gender.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.gender}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Age Distribution */}
        {chartData.age.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.age}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Emotion Distribution */}
        {chartData.emotion.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Emotion Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.emotion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.emotion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.emotion[index % COLORS.emotion.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Ethnicity Distribution */}
        {chartData.ethnicity.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ethnicity Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.ethnicity}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.ethnicity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.ethnicity[index % COLORS.ethnicity.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Time Series Chart */}
      {chartData.timeSeries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detection Timeline (Daily)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Detections"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}