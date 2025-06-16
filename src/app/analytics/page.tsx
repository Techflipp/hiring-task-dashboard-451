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
  UserCheck,
  Zap
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
  const { data: results, isLoading: resultsLoading } = useDemographicsResults({
    camera_id: selectedCameraId,
    ...(filters.gender && { gender: filters.gender as Gender }),
    ...(filters.age && { age: filters.age as Age }),
    ...(filters.emotion && { emotion: filters.emotion as Emotion }),
    ...(filters.ethnicity && { ethnicity: filters.ethnicity as EthnicGroup }),
    ...(filters.startDate && { start_date: filters.startDate }),
    ...(filters.endDate && { end_date: filters.endDate }),
  });

  const filteredResults = Array.isArray(results) ? results : [];

  const totalDetections = filteredResults.length;
  const genderBreakdown = filteredResults.reduce((acc, result) => {
    acc[result.gender] = (acc[result.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageBreakdown = filteredResults.reduce((acc, result) => {
    acc[result.age] = (acc[result.age] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emotionBreakdown = filteredResults.reduce((acc, result) => {
    acc[result.emotion] = (acc[result.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ethnicityBreakdown = filteredResults.reduce((acc, result) => {
    acc[result.ethnicity] = (acc[result.ethnicity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


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
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
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
                  <option value="0-2">0-2 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="8-12">8-12 years</option>
                  <option value="15-20">15-20 years</option>
                  <option value="25-32">25-32 years</option>
                  <option value="38-43">38-43 years</option>
                  <option value="48-53">48-53 years</option>
                  <option value="60-100">60+ years</option>
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
                  <option value="ANGRY">😠 Angry</option>
                  <option value="DISGUST">🤢 Disgust</option>
                  <option value="FEAR">😨 Fear</option>
                  <option value="HAPPY">😊 Happy</option>
                  <option value="NEUTRAL">😐 Neutral</option>
                  <option value="SAD">😢 Sad</option>
                  <option value="SURPRISE">😲 Surprise</option>
                </select>
              </div>

              {/* Ethnicity Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Globe className="h-4 w-4 text-rose-500" />
                  Ethnicity
                </label>
                <select
                  value={filters.ethnicity}
                  onChange={(e) => setFilters(prev => ({ ...prev, ethnicity: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all duration-200"
                >
                  <option value="">All Ethnicities</option>
                  <option value="WHITE">White</option>
                  <option value="BLACK">Black</option>
                  <option value="ASIAN">Asian</option>
                  <option value="INDIAN">Indian</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {resultsLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
              <span className="text-lg text-gray-600">Analyzing demographics data...</span>
            </div>
          </div>
        )}

        {/* No Camera Selected */}
        {!selectedCameraId && !resultsLoading && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Camera to Begin</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose a camera from the dropdown above to view comprehensive demographics analytics and insights.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {selectedCameraId && !resultsLoading && (
          <>

            {/* Data Breakdown Cards */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Gender Breakdown */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                                <CardContent>
                  {totalDetections > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(genderBreakdown).map(([gender, count]) => {
                        const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                        return (
                          <div key={gender} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="capitalize">{gender.toLowerCase()}</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                               <div 
                                 className={`h-3 rounded-full transition-all duration-500 ${
                                   gender === Gender.MALE ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                                   'bg-gradient-to-r from-pink-500 to-rose-500'
                                 }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No gender data available</p>
                      <p className="text-gray-400 text-xs mt-1">Select a camera with analytics data</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Age Breakdown */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Age Group Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalDetections > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(ageBreakdown).map(([age, count]) => {
                        const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                        return (
                          <div key={age} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span>{age} years</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No age group data available</p>
                      <p className="text-gray-400 text-xs mt-1">Select a camera with analytics data</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emotion Breakdown */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    Emotion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalDetections > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(emotionBreakdown).map(([emotion, count]) => {
                        const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                        const emotionEmoji = {
                          'ANGRY': '😠',
                          'DISGUST': '🤢',
                          'FEAR': '😨',
                          'HAPPY': '😊',
                          'NEUTRAL': '😐',
                          'SAD': '😢',
                          'SURPRISE': '😲'
                        }[emotion] || '😐';
                        
                        return (
                          <div key={emotion} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <span>{emotionEmoji}</span>
                                <span className="capitalize">{emotion.toLowerCase()}</span>
                              </span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Brain className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No emotion data available</p>
                      <p className="text-gray-400 text-xs mt-1">Select a camera with analytics data</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ethnicity Breakdown */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    Ethnicity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {totalDetections > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(ethnicityBreakdown).map(([ethnicity, count]) => {
                        const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
                        return (
                          <div key={ethnicity} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="capitalize">{ethnicity.toLowerCase()}</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Globe className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No ethnicity data available</p>
                      <p className="text-gray-400 text-xs mt-1">Select a camera with analytics data</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Detections */}
            {totalDetections > 0 && (
              <Card className="mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Recent Detections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Gender</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Emotion</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Ethnicity</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.slice(0, 10).map((result, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4 text-gray-600">
                              {formatDate(result.timestamp)}
                            </td>
                            <td className="py-3 px-4">
                                                             <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                 result.gender === Gender.MALE 
                                   ? 'bg-blue-100 text-blue-800' 
                                   : 'bg-pink-100 text-pink-800'
                               }`}>
                                {result.gender}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{result.age}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {result.emotion}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{result.ethnicity}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                    style={{ width: `${result.confidence * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {(result.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {totalDetections === 0 && (
              <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <BarChart3 className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No demographics data found for the selected camera and filters. Try adjusting your filters or selecting a different camera.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
            <span className="text-lg text-gray-600">Loading analytics...</span>
          </div>
        </div>
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
} 