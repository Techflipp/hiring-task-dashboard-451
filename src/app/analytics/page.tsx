'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Download, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity,
  Brain,
  Globe,
  Calendar,
  Eye,
  UserCheck
} from 'lucide-react';
import { 
  useCameras, 
  useDemographicsResults 
} from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { formatDate } from '@/lib/utils';
import { Gender, Age, Emotion, EthnicGroup } from '@/types/api';

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const [selectedCameraId, setSelectedCameraId] = useState<string>(
    searchParams.get('camera_id') || ''
  );
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    emotion: '',
    ethnicity: '',
    startDate: '',
    endDate: '',
  });

  const { data: cameras } = useCameras({ size: 100 });
  const { data: demographicsData, isLoading: resultsLoading } = useDemographicsResults({
    camera_id: selectedCameraId,
    ...(filters.gender && { gender: filters.gender as Gender }),
    ...(filters.age && { age: filters.age as Age }),
    ...(filters.emotion && { emotion: filters.emotion as Emotion }),
    ...(filters.ethnicity && { ethnicity: filters.ethnicity as EthnicGroup }),
    ...(filters.startDate && { start_date: filters.startDate }),
    ...(filters.endDate && { end_date: filters.endDate }),
  });

  const results = demographicsData?.items || [];
  const analytics = demographicsData?.analytics;

  const totalDetections = analytics?.total_count || 0;
  const genderBreakdown = analytics?.gender_distribution || {};
  const ageBreakdown = analytics?.age_distribution || {};
  const emotionBreakdown = analytics?.emotion_distribution || {};
  const ethnicityBreakdown = analytics?.ethnicity_distribution || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                Demographics Analytics
              </h1>
              <p className="mt-3 text-lg text-gray-600 max-w-3xl">
                Gain deep insights into visitor demographics with advanced analytics and real-time data visualization from your camera network.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Camera Selection Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              Camera Selection & Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Camera Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Select Camera
                </label>
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="">Choose a camera...</option>
                  {cameras?.items?.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users className="h-4 w-4 text-purple-500" />
                  Gender
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Age Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  Age Group
                </label>
                <select
                  value={filters.age}
                  onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                >
                  <option value="">All Ages</option>
                  <option value="0-18">0-18 years</option>
                  <option value="19-30">19-30 years</option>
                  <option value="31-45">31-45 years</option>
                  <option value="46-60">46-60 years</option>
                  <option value="60+">60+ years</option>
                </select>
              </div>

              {/* Emotion Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Brain className="h-4 w-4 text-amber-500" />
                  Emotion
                </label>
                <select
                  value={filters.emotion}
                  onChange={(e) => setFilters(prev => ({ ...prev, emotion: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                >
                  <option value="">All Emotions</option>
                  <option value="angry">😠 Angry</option>
                  <option value="fear">😨 Fear</option>
                  <option value="happy">😊 Happy</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="sad">😢 Sad</option>
                  <option value="surprise">😲 Surprise</option>
                </select>
              </div>

              {/* Ethnicity Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Globe className="h-4 w-4 text-indigo-500" />
                  Ethnicity
                </label>
                <select
                  value={filters.ethnicity}
                  onChange={(e) => setFilters(prev => ({ ...prev, ethnicity: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                >
                  <option value="">All Ethnicities</option>
                  <option value="white">White</option>
                  <option value="african">African</option>
                  <option value="south_asian">South Asian</option>
                  <option value="east_asian">East Asian</option>
                  <option value="middle_eastern">Middle Eastern</option>
                </select>
              </div>

              {/* Date Range Filters */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-rose-500" />
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-rose-500" />
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all duration-200"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => setFilters({
                    gender: '',
                    age: '',
                    emotion: '',
                    ethnicity: '',
                    startDate: '',
                    endDate: '',
                  })}
                  variant="outline"
                  className="w-full rounded-xl border-2 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview Cards */}
        {selectedCameraId && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Detections</p>
                      <p className="text-3xl font-bold">{totalDetections.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Most Common Gender</p>
                      <p className="text-xl font-bold">
                        {Object.entries(genderBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Most Common Age</p>
                      <p className="text-xl font-bold">
                        {Object.entries(ageBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-emerald-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">Most Common Emotion</p>
                      <p className="text-xl font-bold">
                        {Object.entries(emotionBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-amber-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribution Charts */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {/* Gender Distribution */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(genderBreakdown).map(([gender, count]) => (
                      <div key={gender} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{gender}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                              style={{ width: `${totalDetections > 0 ? (count / totalDetections) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(ageBreakdown).map(([age, count]) => (
                      <div key={age} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{age}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full"
                              style={{ width: `${totalDetections > 0 ? (count / totalDetections) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emotion Distribution */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    Emotion Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(emotionBreakdown).map(([emotion, count]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full"
                              style={{ width: `${totalDetections > 0 ? (count / totalDetections) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ethnicity Distribution */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    Ethnicity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(ethnicityBreakdown).map(([ethnicity, count]) => (
                      <div key={ethnicity} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {ethnicity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${totalDetections > 0 ? (count / totalDetections) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            {results.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Detailed Detection Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-lg">
                        <tr>
                          <th className="px-6 py-3">Count</th>
                          <th className="px-6 py-3">Gender</th>
                          <th className="px-6 py-3">Age</th>
                          <th className="px-6 py-3">Emotion</th>
                          <th className="px-6 py-3">Ethnicity</th>
                          <th className="px-6 py-3">Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.slice(0, 50).map((result) => (
                          <tr key={result.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{result.count}</td>
                            <td className="px-6 py-4 capitalize">{result.gender}</td>
                            <td className="px-6 py-4">{result.age}</td>
                            <td className="px-6 py-4 capitalize">{result.emotion}</td>
                            <td className="px-6 py-4">
                              {result.ethnicity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </td>
                            <td className="px-6 py-4">{formatDate(result.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {results.length > 50 && (
                    <p className="text-sm text-gray-500 mt-4">
                      Showing first 50 results of {results.length} total detections.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* No Camera Selected State */}
        {!selectedCameraId && (
          <div className="text-center py-16">
            <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Camera to View Analytics</h3>
            <p className="text-gray-600">Choose a camera from the dropdown above to start exploring demographics data.</p>
          </div>
        )}

        {/* Loading State */}
        {selectedCameraId && resultsLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Loading Analytics...</h3>
            <p className="text-gray-600">Fetching demographics data from the selected camera.</p>
          </div>
        )}

        {/* No Data State */}
        {selectedCameraId && !resultsLoading && totalDetections === 0 && (
          <div className="text-center py-16">
            <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No demographics data found for the selected camera and filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
} 