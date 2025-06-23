'use client';

import { useState } from 'react';
import { useCamera } from '@/hooks/use-cameras';
import { useDemographicsResults } from '@/hooks/use-demographics';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Gender, Age, Emotion, Ethnicity } from '@/types/api';
import { CustomSelect } from '@/components/ui/custom-select';
import { CustomDateInput } from '@/components/ui/custom-date-input';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: camera, isLoading: isLoadingCamera, error: cameraError } = useCamera(params.id);
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    emotion: '',
    ethnicity: '',
    start_date: '',
    end_date: '',
  });

  const { 
    data: results, 
    isLoading: isLoadingResults,
    error: resultsError 
  } = useDemographicsResults(params.id, filters);

  if (isLoadingCamera || isLoadingResults) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">Error loading camera: {cameraError.message}</div>
        <Link href="/cameras">
          <p className="text-[15px] font-[600] text-[#043872]">Back to Cameras</p>
        </Link>
      </div>
    );
  }

  if (resultsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">Error loading analytics data: {resultsError.message}</div>
        <Link href={`/cameras/${params.id}`}>
          <Button>Back to Camera Details</Button>
        </Link>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">Camera not found</div>
        <Link href="/cameras">
          <Button>Back to Cameras</Button>
        </Link>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <Link
            href={`/cameras/${params.id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to camera details
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Analytics for {camera.name}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-gray-500 mb-4">No analytics data available for this camera</div>
          <div className="text-sm text-gray-400">Try adjusting the filters or check back later</div>
        </div>
      </div>
    );
  }

  // Process data for charts
  const genderData = results.reduce((acc: any[], result) => {
    const existing = acc.find((item) => item.name === result.gender);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: result.gender, value: 1 });
    }
    return acc;
  }, []);

  const ageData = results.reduce((acc: any[], result) => {
    const existing = acc.find((item) => item.name === result.age);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: result.age, value: 1 });
    }
    return acc;
  }, []);

  const emotionData = results.reduce((acc: any[], result) => {
    const existing = acc.find((item) => item.name === result.emotion);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: result.emotion, value: 1 });
    }
    return acc;
  }, []);

  const ethnicityData = results.reduce((acc: any[], result) => {
    const existing = acc.find((item) => item.name === result.ethnicity);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: result.ethnicity, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="py-8">
      <div className="mb-8">
        <Link
          href={`/cameras/${params.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to camera details
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Analytics for {camera.name}
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CustomSelect
          value={filters.gender}
          onChange={(value) => setFilters({ ...filters, gender: value as string })}
          options={[
            { value: '', label: 'All Genders' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />

        <CustomSelect
          value={filters.age}
          onChange={(value) => setFilters({ ...filters, age: value as string })}
          options={[
            { value: '', label: 'All Ages' },
            { value: '0-18', label: '0-18' },
            { value: '19-30', label: '19-30' },
            { value: '31-45', label: '31-45' },
            { value: '46-60', label: '46-60' },
            { value: '60+', label: '60+' },
          ]}
        />

        <CustomSelect
          value={filters.emotion}
          onChange={(value) => setFilters({ ...filters, emotion: value as string })}
          options={[
            { value: '', label: 'All Emotions' },
            { value: 'angry', label: 'Angry' },
            { value: 'fear', label: 'Fear' },
            { value: 'happy', label: 'Happy' },
            { value: 'neutral', label: 'Neutral' },
            { value: 'sad', label: 'Sad' },
            { value: 'surprise', label: 'Surprise' },
          ]}
        />

        <CustomSelect
          value={filters.ethnicity}
          onChange={(value) => setFilters({ ...filters, ethnicity: value as string })}
          options={[
            { value: '', label: 'All Ethnicities' },
            { value: 'white', label: 'White' },
            { value: 'african', label: 'African' },
            { value: 'south_asian', label: 'South Asian' },
            { value: 'east_asian', label: 'East Asian' },
            { value: 'middle_eastern', label: 'Middle Eastern' },
          ]}
        />

        <CustomDateInput
          value={filters.start_date}
          onChange={(value) => setFilters({ ...filters, start_date: value })}
          placeholder="Start Date"
        />

        <CustomDateInput
          value={filters.end_date}
          onChange={(value) => setFilters({ ...filters, end_date: value })}
          placeholder="End Date"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Age Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Emotion Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ethnicity Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ethnicityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ethnicityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 