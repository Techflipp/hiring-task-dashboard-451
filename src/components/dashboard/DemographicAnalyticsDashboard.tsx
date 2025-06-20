"use client";

import { useState } from "react";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Button } from "../ui/Button";
import { AnalyticsCharts } from "./ResultsChart";
import { DemographicsTable } from "./DemographicTable";
import { useAnalytics } from "@/hooks/useAnalytics";

const genders = ["male", "female"];
const ages = ["0-18", "19-30", "31-45", "46-60", "60+"];
const emotions = ["angry", "fear", "happy", "neutral", "sad", "surprise"];
const ethnicities = [
  "white",
  "african",
  "south_asian",
  "east_asian",
  "middle_eastern",
];

interface Filters {
  gender: string;
  age: string;
  emotion: string;
  ethnicity: string;
  start_date: string;
  end_date: string;
}

export const DemographicsAnalyticsDashboard = ({
  cameraId,
}: {
  cameraId: string;
}) => {
  const initState = {
    gender: "",
    age: "",
    emotion: "",
    ethnicity: "",
    start_date: "",
    end_date: "",
  }
  const [filters, setFilters] = useState<Filters>(initState);

  const { data, isLoading, error, refetch } = useAnalytics({
    camera_id: cameraId,
    ...filters,
  });
  const handleClear=()=> {
    setFilters(()=> initState);
    refetch()
  }

  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded-md shadow">
        <Select
          onValueChange={(value) => handleChange("gender", value)}
          defaultValue=""
          value={filters.gender}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            {genders.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: string) => handleChange("age", value)}
          defaultValue=""
          value={filters.age}
        >
          <SelectTrigger>
            <SelectValue placeholder="Age Group" />
          </SelectTrigger>
          <SelectContent>
            {ages.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleChange("emotion", value)}
          defaultValue=""
          value={filters.emotion}
        >
          <SelectTrigger>
            <SelectValue placeholder="Emotion" />
          </SelectTrigger>
          <SelectContent>
            {emotions.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleChange("ethnicity", value)}
          defaultValue=""
          value={filters.ethnicity}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ethnicity" />
          </SelectTrigger>
          <SelectContent>
            {ethnicities.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={filters.end_date}
          onChange={(e) => handleChange("end_date", e.target.value)}
          placeholder="End Date"
        />

        <div className="col-span-full flex justify-end">
          <Button onClick={() => refetch()}>Apply Filters</Button>
          <Button className="bg-orange-400 ml-2" onClick={() => handleClear()}>Clear</Button>
        </div>
      </div>

      {/* 📊 Analytics Results */}
      {isLoading && <p>Loading analytics...</p>}
      {error && <p className="text-red-500">Error loading data</p>}
      {(data?.analytics && !isLoading)  && (
        <div className="space-y-6">
          <AnalyticsCharts
            gender={data.analytics.gender_distribution}
            age={data.analytics.age_distribution}
            emotion={data.analytics.emotion_distribution}
            ethnicity={data.analytics.ethnicity_distribution}
          />
        </div>
      )}
      {(data?.items && !isLoading)  && (
        <div className="space-y-6">
          <DemographicsTable
            items={data.items}
          />
        </div>
      )}
    </div>
  );
};
