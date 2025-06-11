import React from 'react';
import { useDemographicsResults } from '@/lib/hooks/useDemographics';
// import { Select } from '../ui/Select';
// import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { DemographicsCharts } from './DemographicsCharts';
// import { Gender, AgeGroup, Emotion, EthnicGroup } from '@/lib/types';
import { TrendingUp } from 'lucide-react';
// import { format } from 'date-fns';

interface DemographicsResultsProps {
  cameraId: string;
}

export const DemographicsResults: React.FC<DemographicsResultsProps> = ({ cameraId }) => {
  // const [filters, setFilters] = useState({
  //   gender: '',
  //   age: '',
  //   emotion: '',
  //   ethnicity: '',
  //   start_date: '',
  //   end_date: '',
  // });

  const { data, isLoading } = useDemographicsResults({
    camera_id: cameraId,
    // ...filters,
  });

  // const genderOptions = Object.values(Gender).map(value => ({ value, label: value }));
  // const ageOptions = Object.values(AgeGroup).map(value => ({ value, label: value }));
  // const emotionOptions = Object.values(Emotion).map(value => ({ value, label: value }));
  // const ethnicityOptions = Object.values(EthnicGroup).map(value => ({ value, label: value }));

  // const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
  //   // Convert datetime-local to ISO string if value is not empty
  //   const isoValue = value ? new Date(value).toISOString() : '';
  //   setFilters({ ...filters, [field]: isoValue });
  // };

  return (
    <div className="space-y-6">
      {/* <Card>
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Gender"
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            options={genderOptions}
          />
          <Select
            label="Age Group"
            value={filters.age}
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            options={ageOptions}
          />
          <Select
            label="Emotion"
            value={filters.emotion}
            onChange={(e) => setFilters({ ...filters, emotion: e.target.value })}
            options={emotionOptions}
          />
          <Select
            label="Ethnicity"
            value={filters.ethnicity}
            onChange={(e) => setFilters({ ...filters, ethnicity: e.target.value })}
            options={ethnicityOptions}
          />
          <Input
            label="Start Date"
            type="datetime-local"
            value={filters.start_date ? format(new Date(filters.start_date), "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => handleDateChange('start_date', e.target.value)}
          />
          <Input
            label="End Date"
            type="datetime-local"
            value={filters.end_date ? format(new Date(filters.end_date), "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => handleDateChange('end_date', e.target.value)}
          />
        </div>
      </Card> */}

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