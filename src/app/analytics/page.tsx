'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Filter, Download, Eye, UserCheck, Camera } from 'lucide-react';
import { useDemographicsResults, useCameras } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { LoadingState } from '@/components/ui/loading-spinner';
import { Navbar } from '@/components/layout/navbar';
import { formatDate } from '@/lib/utils';
import { Gender, Age, Emotion, EthnicGroup } from '@/types/api';

export default function AnalyticsPage() {
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [ageGroup, setAgeGroup] = useState('all');
  const [gender, setGender] = useState('all');
  const [emotion, setEmotion] = useState('all');
  const [ethnicity, setEthnicity] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const { data: cameras } = useCameras({ size: 100 });
  const { data, isLoading, error } = useDemographicsResults({
    camera_id: selectedCameraId,
    age: ageGroup !== 'all' ? (ageGroup as Age) : undefined,
    gender: gender !== 'all' ? (gender as Gender) : undefined,
    emotion: emotion !== 'all' ? (emotion as Emotion) : undefined,
    ethnicity: ethnicity !== 'all' ? (ethnicity as EthnicGroup) : undefined,
  });

  const results = data?.items || [];
  const analytics = data?.analytics;

  const totalDetections = analytics?.total_count || 0;
  const genderBreakdown = analytics?.gender_distribution || {};
  const ageBreakdown = analytics?.age_distribution || {};
  const emotionBreakdown = analytics?.emotion_distribution || {};
  // const ethnicityBreakdown = analytics?.ethnicity_distribution || {};

  const exportToCSV = async () => {
    if (!results.length) return;
    
    setIsExporting(true);
    
    try {
      // Create CSV headers
      const headers = ['Count', 'Gender', 'Age', 'Emotion', 'Ethnicity', 'Created At'];
      
      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...results.map(result => [
          result.count,
          result.gender,
          result.age,
          result.emotion,
          result.ethnicity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          formatDate(result.created_at)
        ].map(field => `"${field}"`).join(','))
      ];
      
      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        // Generate filename with camera name and timestamp
        const selectedCamera = cameras?.items?.find(camera => camera.id === selectedCameraId);
        const cameraName = selectedCamera?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Camera';
        const timestamp = new Date().toISOString().split('T')[0];
        const recordCount = results.length;
        link.setAttribute('download', `${cameraName}_demographics_${recordCount}_records_${timestamp}.csv`);
        
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <BarChart3 className="h-4 w-4" />
            <AlertDescription>
              Error loading analytics: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Analytics Dashboard</h1>
              <p className="text-gray-700 dark:text-gray-300">
                Insights and demographics data from your camera network
              </p>
            </div>
          </div>
        </div>

        {/* Camera Selection & Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Filter className="h-5 w-5" />
              Camera Selection & Filters
            </CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-300">
              Select a camera and apply filters to analyze demographics data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Select Camera
                </label>
                <Select value={selectedCameraId} onValueChange={setSelectedCameraId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose camera..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras?.items?.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id}>
                        {camera.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Age Group
                </label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="0-18">0-18 years</SelectItem>
                    <SelectItem value="19-30">19-30 years</SelectItem>
                    <SelectItem value="31-45">31-45 years</SelectItem>
                    <SelectItem value="46-60">46-60 years</SelectItem>
                    <SelectItem value="60+">60+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gender
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Emotion
                </label>
                <Select value={emotion} onValueChange={setEmotion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Emotions</SelectItem>
                    <SelectItem value="angry">Angry</SelectItem>
                    <SelectItem value="fear">Fear</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="surprise">Surprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Ethnicity
                </label>
                <Select value={ethnicity} onValueChange={setEthnicity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ethnicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ethnicities</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="african">African</SelectItem>
                    <SelectItem value="south_asian">South Asian</SelectItem>
                    <SelectItem value="east_asian">East Asian</SelectItem>
                    <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedCameraId && (
          <>
            {/* Summary Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    Total Detections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDetections.toLocaleString()}</div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Demographics analyzed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Most Common Gender
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {Object.entries(genderBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Gender analysis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    Most Common Age
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {Object.entries(ageBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Age analysis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    Most Common Emotion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {Object.entries(emotionBreakdown).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Emotion analysis</p>
                </CardContent>
              </Card>
            </div>

            {/* Distribution Charts */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(genderBreakdown).map(([gender, count]) => (
                      <div key={gender} className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">{gender}</span>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={totalDetections > 0 ? (count / totalDetections) * 100 : 0} 
                            className="w-32"
                          />
                          <span className="text-sm font-bold w-12 text-right text-gray-900 dark:text-gray-100">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(ageBreakdown).map(([age, count]) => (
                      <div key={age} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{age}</span>
                        <div className="flex items-center gap-3">
                          <Progress 
                            value={totalDetections > 0 ? (count / totalDetections) * 100 : 0} 
                            className="w-32"
                          />
                          <span className="text-sm font-bold w-12 text-right text-gray-900 dark:text-gray-100">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Detection Results
                      </CardTitle>
                      <CardDescription>
                        Detailed demographics data (showing first 50 results)
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportToCSV}
                      disabled={!results.length || isExporting}
                    >
                      <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                      {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Count</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Emotion</TableHead>
                          <TableHead>Ethnicity</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.slice(0, 50).map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.count}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {result.gender}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {result.age}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {result.emotion}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {result.ethnicity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(result.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {results.length > 50 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Showing first 50 results of {results.length} total detections.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <LoadingState 
                title="Loading Analytics Data"
                description="Fetching demographics data and generating insights..."
              />
            )}

            {/* No Data State */}
            {!isLoading && totalDetections === 0 && (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No analytics data found</h3>
                <p className="text-muted-foreground">
                  No demographics data found for the selected camera and filters.
                </p>
              </div>
            )}
          </>
        )}

        {/* No Camera Selected State */}
        {!selectedCameraId && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Select a Camera to View Analytics</h3>
            <p className="text-muted-foreground">
              Choose a camera from the dropdown above to start exploring demographics data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 