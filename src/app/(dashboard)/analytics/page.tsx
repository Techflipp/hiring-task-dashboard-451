"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDemographicsResults } from "@/app/_lib/api";
import {
  AnalyticsFilters,
  ResultsChart,
  ResultsTable,
} from "@/app/_components/analytics";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    camera_id: "",
    gender: "",
    age: "",
    emotion: "",
    ethnicity: "",
    start_date: "",
    end_date: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", filters],
    queryFn: () => getDemographicsResults(filters),
    enabled: !!filters.camera_id,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Demographics Analytics</h1>

      <AnalyticsFilters filters={filters} onChange={setFilters} />

      {isLoading && <div>Loading...</div>}

      {error && <div className="text-red-500">Error loading data</div>}

      {data && (
        <div className="mt-8 space-y-8">
          <ResultsChart data={data} />
          <ResultsTable data={data} />
        </div>
      )}
    </div>
  );
}
