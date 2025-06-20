"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { components } from "@/services/api/types";

type DemographicsResult = components["schemas"]["DemographicsResult"];

interface DemographicsTableProps {
  data: DemographicsResult[];
}

export function DemographicsTable({ data }: DemographicsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof DemographicsResult>("count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: keyof DemographicsResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatValue = (value: any, field: string) => {
    if (field === "created_at") {
      return new Date(value).toLocaleString();
    }
    if (
      field === "gender" ||
      field === "age" ||
      field === "emotion" ||
      field === "ethnicity"
    ) {
      return value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ");
    }
    return value;
  };

  const SortIcon = ({ field }: { field: keyof DemographicsResult }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("count")}
            >
              <div className="flex items-center gap-2">
                Count
                <SortIcon field="count" />
              </div>
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("gender")}
            >
              <div className="flex items-center gap-2">
                Gender
                <SortIcon field="gender" />
              </div>
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("age")}
            >
              <div className="flex items-center gap-2">
                Age
                <SortIcon field="age" />
              </div>
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("emotion")}
            >
              <div className="flex items-center gap-2">
                Emotion
                <SortIcon field="emotion" />
              </div>
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("ethnicity")}
            >
              <div className="flex items-center gap-2">
                Ethnicity
                <SortIcon field="ethnicity" />
              </div>
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-300 cursor-pointer hover:text-white"
              onClick={() => handleSort("created_at")}
            >
              <div className="flex items-center gap-2">
                Created At
                <SortIcon field="created_at" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
            >
              <td className="py-3 px-4 font-medium">{item.count}</td>
              <td className="py-3 px-4">
                {formatValue(item.gender, "gender")}
              </td>
              <td className="py-3 px-4">{formatValue(item.age, "age")}</td>
              <td className="py-3 px-4">
                {formatValue(item.emotion, "emotion")}
              </td>
              <td className="py-3 px-4">
                {formatValue(item.ethnicity, "ethnicity")}
              </td>
              <td className="py-3 px-4 text-gray-400">
                {formatValue(item.created_at, "created_at")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)}{" "}
            of {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
