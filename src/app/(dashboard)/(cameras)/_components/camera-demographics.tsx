'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

import {
  demographicsQueryFn,
  demographicsQueryKey,
} from '@/app/_lib/react-query/queries/demographics.queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#60a5fa', '#f87171', '#fbbf24', '#34d399', '#a78bfa', '#f472b6'];

const GENDER_OPTIONS = ['male', 'female'];
const EMOTION_OPTIONS = ['happy', 'sad', 'angry', 'neutral', 'fear', 'surprise'];
const ETHNICITY_OPTIONS = ['white', 'african', 'south_asian', 'east_asian', 'middle_east'];
const AGE_OPTIONS = ['0-18', '19-30', '31-45', '46-60', '60+'];

export default function CameraDemographics({
  demographicsParams: defaultParams,
}: {
  demographicsParams: {
    camera_id: string;
    gender: string;
    age: string;
    emotion: string;
    ethnicity: string;
    start_date: string;
    end_date: string;
  };
}) {
  const [params, setParams] = useState(defaultParams);

  const { data, isLoading, error } = useQuery({
    queryKey: demographicsQueryKey(params),
    queryFn: () => demographicsQueryFn(params),
  });

  const formatData = (obj: Record<string, number>) =>
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  const handleChange = (key: keyof typeof params, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = () => {
    setParams(defaultParams);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Demographics Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Filter Controls */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <CardTitle>Filters</CardTitle>
                <Button className='cursor-pointer' onClick={clearFilter}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
              <div className='space-y-2'>
                <Label>Gender</Label>
                <Select value={params.gender} onValueChange={(val) => handleChange('gender', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Age</Label>
                <Select value={params.age} onValueChange={(val) => handleChange('age', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select age group' />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_OPTIONS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Emotion</Label>
                <Select
                  value={params.emotion}
                  onValueChange={(val) => handleChange('emotion', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select emotion' />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOTION_OPTIONS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Ethnicity</Label>
                <Select
                  value={params.ethnicity}
                  onValueChange={(val) => handleChange('ethnicity', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select ethnicity' />
                  </SelectTrigger>
                  <SelectContent>
                    {ETHNICITY_OPTIONS.map((eth) => (
                      <SelectItem key={eth} value={eth}>
                        {eth}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Start Date</Label>
                <Input
                  type='date'
                  value={params.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label>End Date</Label>
                <Input
                  type='date'
                  value={params.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chart Cards */}
          {isLoading ? (
            <Skeleton className='h-[80vh] w-full' />
          ) : error || !data?.data?.analytics ? (
            <div className='text-red-500'>Error loading Demographics details.</div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Surveillance Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center text-4xl font-bold'>
                    {data.data.analytics.total_count}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={200}>
                    <PieChart>
                      <Pie
                        data={formatData(data.data.analytics.gender_distribution)}
                        dataKey='value'
                        nameKey='name'
                        outerRadius={80}
                      >
                        {formatData(data.data.analytics.gender_distribution).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={200}>
                    <BarChart data={formatData(data.data.analytics.age_distribution)}>
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey='value' fill='#60a5fa' />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emotion Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={250}>
                    <RadarChart data={formatData(data.data.analytics.emotion_distribution)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey='name' />
                      <Radar
                        name='Emotion'
                        dataKey='value'
                        stroke='#f472b6'
                        fill='#f472b6'
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='md:col-span-2'>
                <CardHeader>
                  <CardTitle>Ethnicity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart
                      layout='vertical'
                      data={formatData(data.data.analytics.ethnicity_distribution)}
                    >
                      <XAxis type='number' />
                      <YAxis type='category' dataKey='name' />
                      <Tooltip />
                      <Bar dataKey='value' fill='#34d399' />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
