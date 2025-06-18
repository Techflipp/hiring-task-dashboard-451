"use client";
import React from "react";
import { FiX, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import { FilterPanelProps } from "@/lib/types";

const filterOptions = {
  gender: ["male", "female"],
  age: ["0-18", "19-30", "31-45", "46-60", "60+"],
  emotion: ["angry", "fear", "happy", "neutral", "sad", "surprise"],
  ethnicity: [
    "white",
    "african",
    "south_asian",
    "east_asian",
    "middle_eastern",
  ],
};

export default function FilterPanel({
  show,
  onClose,
  tempFilters,
  setTempFilters,
  applyFilters,
  resetFilters,
}: FilterPanelProps) {
  const handleFilterChange = (key: string, value: string) => {
    setTempFilters((prev) => {
      if (value === "") {
        const rest = { ...prev };
        delete rest[key];
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 shadow z-50 flex justify-end bg-black/50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white shadow-2xl w-full h-full p-4 sm:p-6 sm:max-w-md overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filter Analytics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(filterOptions).map(([key, values]) => (
            <div key={key}>
              <h3 className="text-lg font-medium text-gray-700 mb-3 capitalize">
                {key}
              </h3>
              <div
                className={`grid ${
                  values.length > 3 ? "grid-cols-2" : "flex flex-wrap"
                } gap-2`}
              >
                {values.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange(key, value)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      tempFilters[key] === value
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {value
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["start_date", "end_date"].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-600 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={tempFilters[field] || ""}
                      onChange={(e) =>
                        handleFilterChange(field, e.target.value)
                      }
                    />
                    <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={resetFilters}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Reset All
          </button>
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}
