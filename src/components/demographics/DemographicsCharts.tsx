import React from 'react';
import { Card } from '../ui/Card';
import { DemographicsResult } from '@/lib/types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface DemographicsChartsProps {
  data: DemographicsResult[];
}

export const DemographicsCharts: React.FC<DemographicsChartsProps> = ({ data }) => {
  // Process data for charts
  const genderData = processDataByAttribute(data, 'gender');
  const ageData = processDataByAttribute(data, 'age');
  const emotionData = processDataByAttribute(data, 'emotion');
  const ethnicityData = processDataByAttribute(data, 'ethnicity');
  const timeSeriesData = processTimeSeriesData(data);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {genderData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Age Distribution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Emotion Distribution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Emotion Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Ethnicity Distribution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Ethnicity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ethnicityData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {ethnicityData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Time Series */}
      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Detection Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="detections" stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary Statistics */}
      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{data.length}</p>
            <p className="text-sm text-gray-500">Total Detections</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {(data.reduce((sum, d) => sum + d.confidence, 0) / data.length * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Avg Confidence</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {new Set(data.map(d => format(new Date(d.timestamp), 'yyyy-MM-dd'))).size}
            </p>
            <p className="text-sm text-gray-500">Days Active</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {Math.round(data.length / new Set(data.map(d => format(new Date(d.timestamp), 'yyyy-MM-dd HH'))).size)}
            </p>
            <p className="text-sm text-gray-500">Avg Detections/Hour</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

function processDataByAttribute(data: DemographicsResult[], attribute: keyof DemographicsResult) {
  const counts: Record<string, number> = {};
  
  data.forEach((item) => {
    const value = item[attribute] as string;
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function processTimeSeriesData(data: DemographicsResult[]) {
  const hourlyData: Record<string, number> = {};
  
  data.forEach((item) => {
    const hour = format(new Date(item.timestamp), 'yyyy-MM-dd HH:00');
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
  });

  return Object.entries(hourlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24) // Last 24 hours
    .map(([time, detections]) => ({
      time: format(new Date(time), 'HH:00'),
      detections,
    }));
}