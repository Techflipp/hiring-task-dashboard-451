"use client";

import { Download, FileText, Table } from "lucide-react";
import type { components } from "@/services/api/types";

type DemographicsResultsResponse =
  components["schemas"]["DemographicsResultsResponse"];

interface ExportControlsProps {
  data: DemographicsResultsResponse;
}

export function ExportControls({ data }: ExportControlsProps) {
  const exportToCSV = () => {
    const headers = [
      "Count",
      "Gender",
      "Age",
      "Emotion",
      "Ethnicity",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...data.items.map((item) =>
        [
          item.count,
          item.gender,
          item.age,
          item.emotion,
          item.ethnicity,
          new Date(item.created_at).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `demographics-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `demographics-data-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAnalytics = () => {
    const analyticsData = {
      summary: {
        total_count: data.analytics.total_count,
        export_date: new Date().toISOString(),
      },
      distributions: {
        gender: data.analytics.gender_distribution,
        age: data.analytics.age_distribution,
        emotion: data.analytics.emotion_distribution,
        ethnicity: data.analytics.ethnicity_distribution,
      },
    };

    const jsonContent = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `demographics-analytics-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Export Data</h3>
        <div className="text-sm text-gray-400">
          {data.items.length} records available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportToCSV}
          className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Table size={20} className="text-blue-400" />
          <div className="text-left">
            <div className="font-medium">Export to CSV</div>
            <div className="text-sm text-gray-400">Download as spreadsheet</div>
          </div>
        </button>

        <button
          onClick={exportToJSON}
          className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <FileText size={20} className="text-green-400" />
          <div className="text-left">
            <div className="font-medium">Export to JSON</div>
            <div className="text-sm text-gray-400">Download raw data</div>
          </div>
        </button>

        <button
          onClick={exportAnalytics}
          className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Download size={20} className="text-purple-400" />
          <div className="text-left">
            <div className="font-medium">Export Analytics</div>
            <div className="text-sm text-gray-400">
              Download summary & charts
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
