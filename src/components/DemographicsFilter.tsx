"use client";

import { useState } from 'react';
import { Camera, Gender, Age, Emotion, EthnicGroup, DemographicsFilters } from '@/types';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DemographicsFilterProps {
  cameras: Camera[];
  onFilterChange: (filters: Partial<DemographicsFilters>) => void;
}

export default function DemographicsFilter({ cameras, onFilterChange }: DemographicsFilterProps) {
  const [filters, setFilters] = useState<Partial<DemographicsFilters>>({});

  const handleValueChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const processedFilters: Partial<DemographicsFilters> = {};
    // Copy all filters, but exclude any that are set to "all"
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        const value = filters[key as keyof typeof filters];
        if (value && value !== 'all') {
          (processedFilters as Record<string, unknown>)[key] = value;
        }
      }
    }
    onFilterChange(processedFilters);
  };

  return (
    <div className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end bg-transparent">
      <div>
        <label htmlFor="camera_id" className="block text-sm font-medium mb-1">Camera</label>
        <Select onValueChange={value => handleValueChange("camera_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Camera" />
          </SelectTrigger>
          <SelectContent>
            {cameras.map(camera => (
              <SelectItem key={camera.id} value={camera.id}>{camera.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
        <Select onValueChange={value => handleValueChange("gender", value)} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(Gender).map(gender => (
              <SelectItem key={gender} value={gender}>{gender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
        <Select onValueChange={value => handleValueChange("age", value)} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(Age).map(age => (
              <SelectItem key={age} value={age}>{age}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="emotion" className="block text-sm font-medium mb-1">Emotion</label>
        <Select onValueChange={value => handleValueChange("emotion", value)} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(Emotion).map(emotion => (
              <SelectItem key={emotion} value={emotion}>{emotion}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="ethnicity" className="block text-sm font-medium mb-1">Ethnicity</label>
        <Select onValueChange={value => handleValueChange("ethnicity", value)} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(EthnicGroup).map(ethnicity => (
              <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium mb-1">Start Date</label>
        <Input
          type="datetime-local"
          id="start_date"
          name="start_date"
          value={filters.start_date || ''}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="end_date" className="block text-sm font-medium mb-1">End Date</label>
        <Input
          type="datetime-local"
          id="end_date"
          name="end_date"
          value={filters.end_date || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-end">
        <Button onClick={handleApplyFilters} className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
}