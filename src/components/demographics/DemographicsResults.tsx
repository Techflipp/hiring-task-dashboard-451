import React, { useState } from 'react';
import { useDemographicsResults } from '@/lib/hooks/useDemographics';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { DemographicsCharts } from './DemographicsCharts';
import { Gender, AgeGroup, Emotion, EthnicGroup } from '@/lib/types';
import { Filter } from 'lucide-react';

interface DemographicsResultsProps {
  cameraId: string;
}

export const DemographicsResults: React.FC<DemographicsResultsProps> = ({ cameraId }) => {
  const [filters, setFilters] = useState({
    gender: '',
    age: '',
    emotion: '',
    ethnicity: '',
    start_date: '',
    end_date: '',
  });

  const { data, isLoading } = useDemographicsResults({
    camera_id: cameraId,
    ...filters,
  });

  const genderOptions = Object.values(Gender).map(value => ({ value, label: value }));
  const ageOptions = Object.values(AgeGroup).map(value => ({ value, label: value }));
  const emotionOptions = Object.values(Emotion).map(value => ({ value, label: value }));
  const ethnicityOptions = Object.values(EthnicGroup).map(value => ({ value, label: value }));

  return (
    <div className="space-y-6">
      <Card>
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
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
          />
          <Input
            label="End Date"
            type="datetime-local"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading demographics data...</span>
          </div>
        </div>
      ) : data && data.length > 0 ? (
        <DemographicsCharts data={data} />
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No demographics data available for the selected filters.</p>
          </div>
        </Card>
      )}
    </div>
  );
};