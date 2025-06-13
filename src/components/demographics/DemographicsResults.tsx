import React from 'react';
import { useDemographicsResults } from '@/lib/hooks/useDemographics';
import { Card } from '../ui/Card';
import { DemographicsCharts } from './DemographicsCharts';
import {  TrendingUp } from 'lucide-react';

interface DemographicsResultsProps {
  cameraId: string;
}

export const DemographicsResults: React.FC<DemographicsResultsProps> = ({ cameraId }) => {
  const { data, isLoading } = useDemographicsResults({
    camera_id: cameraId,
  });

  return (
    <div className="space-y-6">

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading demographics data...</span>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Analytics Summary */}
          {data.analytics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{data.analytics.total_count}</p>
                <p className="text-sm text-gray-500">Total Detections</p>
              </Card>
              
              {Object.entries(data.analytics.gender_distribution).length > 0 && (
                <Card className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Top Gender</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(data.analytics.gender_distribution)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </p>
                </Card>
              )}
              
              {Object.entries(data.analytics.age_distribution).length > 0 && (
                <Card className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Top Age Group</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(data.analytics.age_distribution)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </p>
                </Card>
              )}
              
              {Object.entries(data.analytics.emotion_distribution).length > 0 && (
                <Card className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Top Emotion</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(data.analytics.emotion_distribution)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </p>
                </Card>
              )}
              
              {Object.entries(data.analytics.ethnicity_distribution).length > 0 && (
                <Card className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Top Ethnicity</p>
                  <p className="text-lg font-semibold">
                    {Object.entries(data.analytics.ethnicity_distribution)
                      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                  </p>
                </Card>
              )}
            </div>
          )}

          {data.items.length > 0 || data.analytics.total_count > 0 ? (
            <DemographicsCharts data={data} />
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500">No demographics data available for the selected filters.</p>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No data available.</p>
          </div>
        </Card>
      )}
    </div>
  );
};