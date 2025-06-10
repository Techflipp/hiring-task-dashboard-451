'use client';

import { useState } from 'react';
import type { DemographicsFilters, Gender, AgeGroup, Emotion, EthnicGroup } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Card } from '../ui/card';
import { Filter, X } from 'lucide-react';

interface DemographicsFiltersProps {
  cameraId: string;
  onFiltersChange: (filters: DemographicsFilters) => void;
  initialFilters?: Partial<DemographicsFilters>;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: '0-18', label: '0-18 years' },
  { value: '19-30', label: '19-30 years' },
  { value: '31-45', label: '31-45 years' },
  { value: '46-60', label: '46-60 years' },
  { value: '60+', label: '60+ years' },
];

const EMOTION_OPTIONS: { value: Emotion; label: string }[] = [
  { value: 'angry', label: 'Angry' },
  { value: 'fear', label: 'Fear' },
  { value: 'happy', label: 'Happy' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'sad', label: 'Sad' },
  { value: 'surprise', label: 'Surprise' },
];

const ETHNICITY_OPTIONS: { value: EthnicGroup; label: string }[] = [
  { value: 'white', label: 'White' },
  { value: 'african', label: 'African' },
  { value: 'south_asian', label: 'South Asian' },
  { value: 'east_asian', label: 'East Asian' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
];

export function DemographicsFilters({ 
  cameraId, 
  onFiltersChange, 
  initialFilters = {} 
}: DemographicsFiltersProps) {
  const [filters, setFilters] = useState<DemographicsFilters>({
    camera_id: cameraId,
    ...initialFilters,
  });

  const updateFilter = <K extends keyof DemographicsFilters>(
    key: K, 
    value: string | undefined
  ) => {
    const newFilters = { ...filters };
    
    // Handle special "all" value or empty string as clearing the filter
    if (value === '__all__' || value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      // Proper typing for the assignment
      (newFilters as any)[key] = value;
    }
    
    // Always keep camera_id
    newFilters.camera_id = cameraId;
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { camera_id: cameraId };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'camera_id' && filters[key as keyof DemographicsFilters]
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <Select
            value={filters.gender || '__all__'}
            onValueChange={(value) => updateFilter('gender', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Genders</SelectItem>
              {GENDER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Group
          </label>
          <Select
            value={filters.age || '__all__'}
            onValueChange={(value) => updateFilter('age', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Ages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Ages</SelectItem>
              {AGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emotion
          </label>
          <Select
            value={filters.emotion || '__all__'}
            onValueChange={(value) => updateFilter('emotion', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Emotions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Emotions</SelectItem>
              {EMOTION_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ethnicity
          </label>
          <Select
            value={filters.ethnicity || '__all__'}
            onValueChange={(value) => updateFilter('ethnicity', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Ethnicities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Ethnicities</SelectItem>
              {ETHNICITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            type="datetime-local"
            value={filters.start_date || ''}
            onChange={(e) => updateFilter('start_date', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="datetime-local"
            value={filters.end_date || ''}
            onChange={(e) => updateFilter('end_date', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <strong>Active filters:</strong> {Object.entries(filters)
              .filter(([key, value]) => key !== 'camera_id' && value)
              .map(([key, value]) => {
                const formattedKey = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                return `${formattedKey}: ${value}`;
              })
              .join(', ')}
          </p>
        </div>
      )}
    </Card>
  );
}