"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useParams } from "next/navigation";
import { getDemographicsResults } from "@/services/demographics";
import CustomTable from "@/components/CustomTable";
import AppSpinner from "@/components/AppSpinner/AppSpinner";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type FilterValues = {
  camera_id: string;
  gender: string;
  age: string;
};
type ResultItem = {
  _id: string;
  created_at: string;
  gender: "male" | "female";
  age: string;
  emotion: string;
  ethnicity: string;
  count: number;
};

export default function DemographicsResultsPage() {
  const { id } = useParams();
  const [filters, setFilters] = useState<FilterValues>({
    camera_id: id as string,
    gender: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["demographics-results", filters],
    queryFn: () => getDemographicsResults(filters),
    enabled: !!filters.camera_id,
  });

  const results: ResultItem[] = data?.items || [];

  const countMale = results.filter((r) => r.gender === "male").length;
  const countFemale = results.filter((r) => r.gender === "female").length;

  const ageGroups = {
    child: results.filter((r) => r.age === "0-18").length,
    adult: results.filter((r) => ["19-30", "31-45", "46-60"].includes(r.age)).length,
    senior: results.filter((r) => r.age === "60+").length,
  };

  const columns = [
    {
      key: "timestamp",
      label: "Date",
      render: (item: ResultItem) => new Date(item.created_at).toLocaleString(),
    },
    {
      key: "gender",
      label: "Gender",
      render: (item: ResultItem) => (
        <span className={`font-medium px-2 py-1 rounded ${item.gender === "male" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}>
          {item.gender}
        </span>
      ),
    },
    {
      key: "age",
      label: "Age",
    },
    {
      key: "emotion",
      label: "Emotion",
      render: (item: ResultItem) => <span className="capitalize">{item.emotion}</span>,
    },
    {
      key: "ethnicity",
      label: "Ethnicity",
      render: (item: ResultItem) => <span className="capitalize">{item.ethnicity}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item: ResultItem) =>
        item.count > 20 ? <span className="text-green-600 font-medium">High</span> : <span className="text-yellow-600 font-medium">Low</span>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {isLoading && <AppSpinner />}
      <h1 className="text-2xl font-bold">Demographics Results</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <select name="gender" onChange={handleChange} className="border p-2 rounded">
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select name="age" onChange={handleChange} className="border p-2 rounded">
          <option value="">All Ages</option>
          <option value="0-18">0-18</option>
          <option value="19-30">19-30</option>
          <option value="31-45">31-45</option>
          <option value="46-60">46-60</option>
          <option value="60+">60+</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded"> Total: {results.length}</div>
        <div className="bg-green-100 p-4 rounded"> Male: {countMale}</div>
        <div className="bg-pink-100 p-4 rounded"> Female: {countFemale}</div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Gender Distribution</h2>
          <Pie
            data={{
              labels: ["Male", "Female"],
              datasets: [
                {
                  data: [countMale, countFemale],
                  backgroundColor: ["#60a5fa", "#f472b6"],
                },
              ],
            }}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Age Groups</h2>
          <Bar
            data={{
              labels: ["Child", "Adult", "Senior"],
              datasets: [
                {
                  label: "People",
                  data: [ageGroups.child, ageGroups.adult, ageGroups.senior],
                  backgroundColor: "#34d399",
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Table */}
      <CustomTable columns={columns} data={results} showActions={false} />
    </div>
  );
}
