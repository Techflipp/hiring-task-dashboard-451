import { getDemographicsResults } from "@/lib/api";
import { Suspense } from "react";
import DemographicsResultsFetcher from "./components/demographics-results-fetcher";
import Filters from "./components/Filters";
import DemographicsResultsSkeleton from "./components/ui/demographics-results-skeleton";

type Props = {
  params: Promise<{
    cameraId: string;
  }>;
  searchParams?: Promise<{
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  }>;
};

export default async function DemographicsResultsPage({
  params,
  searchParams,
}: Props) {
  const { cameraId } = await params;
  const resolvedSearchParams = await searchParams;

  // Fetch initial data for Filters and SummaryCards
  const initialData = await getDemographicsResults(
    cameraId,
    resolvedSearchParams
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>
      <Filters isDataEmpty={initialData.items.length === 0} />

      <Suspense
        key={JSON.stringify(resolvedSearchParams)}
        fallback={<DemographicsResultsSkeleton />}
      >
        <DemographicsResultsFetcher
          cameraId={cameraId}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
}
