
import { getDemographicsResults } from "@/lib/api";
import Dashboard from "./Dashboard";
import SummaryCards from "./SummaryCards";

type Props = {
  cameraId: string;
  searchParams?: {
    gender?: string;
    age?: string;
    emotion?: string;
    ethnicity?: string;
    start_date?: string;
    end_date?: string;
  };
};

export default async function DemographicsResultsFetcher({
  cameraId,
  searchParams,
}: Props) {
  const data = await getDemographicsResults(cameraId, searchParams);

  return (
    <>
      <SummaryCards analytics={data.analytics} />
      <Dashboard data={data} />
    </>
  );
}
