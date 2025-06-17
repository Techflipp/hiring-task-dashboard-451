"use client";

import { useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDemographicsResults, getCameras } from '@/lib/api';
import DemographicsFilter from '@/components/DemographicsFilter';
import DemographicsResultsTable from '@/components/DemographicsResultsTable';
import DemographicsChart from '@/components/DemographicsChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

import { DemographicsFilters, DemographicsResponse } from '@/types';

export default function DemographicsPage() {
  const [filters, setFilters] = useState<Partial<DemographicsFilters>>({});

  const { data: camerasData } = useQuery({
    queryKey: ['cameras', 1, 100],
    queryFn: () => getCameras(1, 100)
  });

  const { data: response, isLoading, error } = useQuery<DemographicsResponse, Error>({
    queryKey: ['demographics', filters],
    queryFn: () => getDemographicsResults(filters as DemographicsFilters),
    enabled: !!filters.camera_id,
    retry: 1,
    refetchOnWindowFocus: false,
  });


  // Safely extract results with multiple fallback strategies
  const getResults = () => {
    if (!response) {
      return [];
    }

    // Strategy 1: Direct results property
    if (response.results && Array.isArray(response.results)) {

      return response.results;
    }

    // Strategy 2: Response might be the array itself
    if (Array.isArray(response)) {
      return response;
    }

    // Strategy 3: Check for data property
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // Strategy 4: Check for items property
    if (response.items && Array.isArray(response.items)) {
      return response.items;
    }

    return [];
  };

  const results = getResults();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Demographics Results & Analytics</h1>
        <Link href="/cameras" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Back to Cameras</Link>
      </div>
      
      <div className="rounded-lg shadow p-4 md:p-8 mb-6">
        <DemographicsFilter cameras={camerasData?.items || []} onFilterChange={setFilters} />
      </div>
      
      <div className="rounded-lg shadow p-4 md:p-8">
        {!filters.camera_id ? (
          <p className="mt-4 text-center text-gray-500">Please select a camera to view demographics results.</p>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Demographics Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  </div>
                </CardContent>
              </Card>
              <div className="col-span-3">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">
            <h3 className="font-semibold mb-2">Error loading demographics data:</h3>
            <p>{error.message || 'Unknown error occurred'}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">Debug Info</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify({ filters, error }, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <DemographicsChart results={results} />
                </CardContent>
              </Card>
              <div className="w-full">
                <div className="border rounded-lg p-4 w-full">
                  <h3 className="text-lg font-semibold mb-2">Raw Data ({results.length} records)</h3>
                  <DemographicsResultsTable results={results} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}