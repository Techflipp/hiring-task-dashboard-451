import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { DemographicsResultsResponse } from '@/lib/types';
import { Pagination } from '../ui/Pagination';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DemographicsChartsProps {
  data: DemographicsResultsResponse;
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

export const DemographicsCharts: React.FC<DemographicsChartsProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  // Calculate pagination
  const totalPages = Math.ceil(data.items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.items.slice(startIndex, endIndex);

  // Convert distribution objects to chart data
  const genderData = Object.entries(data.analytics.gender_distribution || {})
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  const ageData = Object.entries(data.analytics.age_distribution || {})
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  const emotionData = Object.entries(data.analytics.emotion_distribution || {})
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  const ethnicityData = Object.entries(data.analytics.ethnicity_distribution || {})
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  // Custom label for pie charts
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution */}
      {genderData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomLabel}
              >
                {genderData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Age Distribution */}
      {ageData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6">
                {ageData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Emotion Distribution */}
      {emotionData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981">
                {emotionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Ethnicity Distribution */}
      {ethnicityData.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Ethnicity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ethnicityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomLabel}
              >
                {ethnicityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}


         {/* Distribution Summary */}
         <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Distribution Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Gender</h4>
            {Object.entries(data.analytics.gender_distribution || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Age Groups</h4>
            {Object.entries(data.analytics.age_distribution || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span>{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Emotions</h4>
            {Object.entries(data.analytics.emotion_distribution || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Ethnicities</h4>
            {Object.entries(data.analytics.ethnicity_distribution || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace('_', ' ')}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Detection Details Table */}
      {data.items.length > 0 && (
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Detections</h3>
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, data.items.length)} of {data.items.length} detections
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ethnicity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.gender || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.age || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.emotion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ethnicity || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card>
      )}

   
    </div>
  );
};