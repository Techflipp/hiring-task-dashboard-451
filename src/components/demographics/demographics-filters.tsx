"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gender, AgeGroup, Emotion, EthnicGroup } from "@/types/enums";
import { Filter, RotateCcw } from "lucide-react";

interface FilterValues {
  gender?: Gender;
  age?: AgeGroup;
  emotion?: Emotion;
  ethnicity?: EthnicGroup;
  start_date?: string;
  end_date?: string;
  [key: string]: string | Gender | AgeGroup | Emotion | EthnicGroup | undefined;
}

interface DemographicsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  defaultValues?: FilterValues;
}

export function DemographicsFilters({
  onFilterChange,
  defaultValues = {},
}: DemographicsFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(defaultValues);

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={filters.gender || ""}
              onChange={(e) => handleFilterChange("gender", e.target.value)}>
              <option value="">All</option>
              {Object.values(Gender).map((gender) => (
                <option key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select
              value={filters.age || ""}
              onChange={(e) => handleFilterChange("age", e.target.value)}>
              <option value="">All</option>
              {Object.values(AgeGroup).map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Emotion</Label>
            <Select
              value={filters.emotion || ""}
              onChange={(e) => handleFilterChange("emotion", e.target.value)}>
              <option value="">All</option>
              {Object.values(Emotion).map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ethnicity</Label>
            <Select
              value={filters.ethnicity || ""}
              onChange={(e) => handleFilterChange("ethnicity", e.target.value)}>
              <option value="">All</option>
              {Object.values(EthnicGroup).map((ethnicity) => (
                <option key={ethnicity} value={ethnicity}>
                  {ethnicity
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              value={filters.start_date || ""}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              value={filters.end_date || ""}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
