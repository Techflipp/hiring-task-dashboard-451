import { DemographicsResult } from "@/types/camera";
import Charts from "./Charts";
import DataTable from "./DataTable";

const Dashboard = ({ data }: { data: DemographicsResult }) => {
  const getFilteredDistribution = (key: "age" | "emotion" | "ethnicity") => {
    const distribution: Record<string, number> = {};
    if (!data) return distribution;

    const allValues = Object.keys(data.analytics[`${key}_distribution`]);
    allValues.forEach((val) => (distribution[val] = 0));
    data.items?.forEach((item) => {
      distribution[item[key]] = (distribution[item[key]] || 0) + item.count;
    });

    return distribution;
  };

  return (
    <>
      <Charts
        analytics={data.analytics}
        filteredData={{
          age_distribution: getFilteredDistribution("age"),
          emotion_distribution: getFilteredDistribution("emotion"),
          ethnicity_distribution: getFilteredDistribution("ethnicity"),
        }}
      />
      <DataTable data={data.items ?? []} />
    </>
  );
};

export default Dashboard;
