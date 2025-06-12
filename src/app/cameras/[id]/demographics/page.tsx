'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../../lib/api';
import { DemographicsFilters } from '../../../../../lib/types';
import { AnalyticsCharts } from '../../../../../components/demographics/analytics-charts';
import { DemographicsFilters as DemographicsFiltersComponent } from '../../../../../components/demographics/filters';
import { Button } from '../../../../../components/ui/button';
import { Card } from '../../../../../components/ui/card';
import { Skeleton } from '../../../../../components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft, Settings, Download, RefreshCw } from 'lucide-react';

export default function CameraDemographicsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  
  const [filters, setFilters] = useState<DemographicsFilters>({
    camera_id: id,
  });

  const { data: camera, isLoading: cameraLoading } = useQuery({
    queryKey: ['camera', id],
    queryFn: () => apiClient.getCamera(id),
    enabled: !!id,
  });

  // Improved query with better caching strategy
  const { 
    data: demographicsResponse, 
    isLoading: demographicsLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['demographics', filters],
    queryFn: async () => {
      // console.log('🔍 Fetching demographics with filters:', filters);
      const result = await apiClient.getDemographicsResults(filters);
      // console.log('📊 Demographics API response:', result);
      return result;
    },
    enabled: !!filters.camera_id,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 2,
  });

  // Extract items array from the response
  const demographics = demographicsResponse?.items || [];
  const analyticsData = demographicsResponse?.analytics;

  // Check if there are active filters
  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'camera_id' && filters[key as keyof DemographicsFilters]
  );

  // Use useCallback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: DemographicsFilters) => {
    // console.log('🔄 Filters changed:', newFilters);
    setFilters(newFilters);
  }, []);

  const exportData = useCallback(() => {
    if (!Array.isArray(demographics) || demographics.length === 0) {
      console.warn('No data to export');
      return;
    }
    
    try {
      const csvContent = [
        ['Timestamp', 'Gender', 'Age', 'Emotion', 'Ethnicity', 'Count', 'Config ID'].join(','),
        ...demographics.map(item => [
          new Date(item.created_at).toISOString(),
          item.gender || '',
          item.age || '',
          item.emotion || '',
          item.ethnicity || '',
          item.count?.toString() || '0',
          item.config_id || '',
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `demographics-${camera?.name || 'camera'}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  }, [demographics, camera?.name]);

  const handleRefresh = useCallback(() => {
    // console.log('🔄 Manual refresh triggered');
    refetch();
  }, [refetch]);

  if (cameraLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
        <Skeleton className="h-48 sm:h-64 w-full" />
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-gray-500 text-sm sm:text-base">Camera not found</p>
        <Link href="/cameras">
          <Button variant="outline" className="mt-4 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
          <Link href={`/cameras/${camera.id}`}>
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Demographics Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600">{camera.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Configuration Button */}
          <Link href={`/cameras/${camera.id}/demographics/config`}>
            <Button variant={camera.demographics_config ? "outline" : "default"} className="w-full sm:w-auto">
              <Settings className="h-4 w-4 mr-2" />
              <span className="sm:hidden">{camera.demographics_config ? 'Edit Config' : 'Configure'}</span>
              <span className="hidden sm:inline">{camera.demographics_config ? 'Edit Configuration' : 'Configure Demographics'}</span>
            </Button>
          </Link>
          
          {Array.isArray(demographics) && demographics.length > 0 && (
            <Button onClick={exportData} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isFetching}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {!camera.demographics_config ? (
        <Card className="p-6 sm:p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Demographics Not Configured
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            This camera doesn&apos;t have demographics configuration set up yet.
          </p>
          <Link href={`/cameras/${camera.id}/demographics/config`}>
            <Button className="w-full sm:w-auto">
              <Settings className="h-4 w-4 mr-2" />
              Set Up Demographics
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <DemographicsFiltersComponent
            cameraId={camera.id}
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />

          {/* Debug info card (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="p-3 sm:p-4 bg-gray-50 border-dashed">
              <h4 className="text-sm font-medium mb-2">Debug Info:</h4>
              <div className="text-xs space-y-1 overflow-x-auto">
                <p><strong>Current Filters:</strong> {JSON.stringify(filters, null, 2)}</p>
                <p><strong>Loading State:</strong> {demographicsLoading ? 'Loading' : 'Loaded'}</p>
                <p><strong>Fetching State:</strong> {isFetching ? 'Fetching' : 'Idle'}</p>
                <p><strong>Records Count:</strong> {demographics.length}</p>
                <p><strong>Has Analytics:</strong> {analyticsData ? 'Yes' : 'No'}</p>
                {error && <p className="text-red-600"><strong>Error:</strong> {(error as Error).message}</p>}
              </div>
            </Card>
          )}

          {demographicsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 sm:h-80 rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Card className="p-6 sm:p-8 text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
              <p className="text-sm sm:text-base text-red-600 mb-4">
                {(error as Error).message || 'An unexpected error occurred'}
              </p>
              <Button onClick={handleRefresh} variant="outline" className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Card>
          ) : (
            <>
              {/* Results summary */}
              <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Showing:</strong> {demographics.length} records
                      {analyticsData && ` (Total detections: ${analyticsData.total_count})`}
                    </p>
                    {hasActiveFilters && (
                      <p className="text-xs text-blue-600 mt-1">
                        Filters applied: {Object.keys(filters).filter(k => k !== 'camera_id' && filters[k as keyof DemographicsFilters]).length}
                      </p>
                    )}
                  </div>
                  {isFetching && (
                    <div className="flex items-center text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Updating...</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Show message when no data found */}
              {demographics.length === 0 && (
                <Card className="p-6 sm:p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    No demographics data matches the current filters. Try adjusting your filters or check if data is being collected.
                  </p>
                  <Button onClick={() => setFilters({ camera_id: id })} variant="outline" className="w-full sm:w-auto">
                    Clear All Filters
                  </Button>
                </Card>
              )}

              {/* Summary stats from analytics if available */}
              {analyticsData && demographics.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{analyticsData.total_count}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Total Count</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {Math.max(...Object.values(analyticsData.gender_distribution || {}))}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Peak Gender Count</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {Object.keys(analyticsData.age_distribution || {}).length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Age Groups</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        {Object.keys(analyticsData.emotion_distribution || {}).length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Emotions</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">
                        {Object.keys(analyticsData.ethnicity_distribution || {}).length}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">Ethnicities</p>
                    </div>
                  </div>
                </Card>
              )}
              
              {demographics.length > 0 && (
                <AnalyticsCharts 
                  data={demographics}
                  analyticsData={analyticsData}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}