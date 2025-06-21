"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Calendar, X } from "lucide-react";
import type { components } from "@/services/api/types";
import {
  GenderEnum,
  AgeEnum,
  EmotionEnum,
  EthnicGroupEnum,
} from "@/services/api/types";
import { DemographicsResultsFormData } from "@/services/schema/demographics-results.schema";

type Camera = components["schemas"]["Camera"];

interface DemographicsFiltersProps {
  register: UseFormRegister<DemographicsResultsFormData>;
  errors: FieldErrors<DemographicsResultsFormData>;
  cameras: Camera[];
  onSubmit: () => void;
  reset: () => void;
}

export function DemographicsFilters({
  register,
  errors,
  cameras,
  onSubmit,
  reset,
}: DemographicsFiltersProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <X size={14} />
          Clear All
        </button>
      </div>

      <form
        onChange={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Camera *
          </label>
          <select
            {...register("camera_id")}
            className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.camera_id ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select a camera</option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.name}
              </option>
            ))}
          </select>
          {errors.camera_id && (
            <p className="mt-1 text-sm text-red-400">
              {errors.camera_id?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender
          </label>
          <select
            {...register("gender")}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            {Object.values(GenderEnum).map((gender) => (
              <option key={gender} value={gender}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age Group
          </label>
          <select
            {...register("age")}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ages</option>
            {Object.values(AgeEnum).map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Emotion
          </label>
          <select
            {...register("emotion")}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Emotions</option>
            {Object.values(EmotionEnum).map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ethnicity
          </label>
          <select
            {...register("ethnicity")}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ethnicities</option>
            {Object.values(EthnicGroupEnum).map((ethnicity) => (
              <option key={ethnicity} value={ethnicity}>
                {ethnicity
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <div className="relative">
            <input
              {...register("start_date")}
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              {...register("end_date")}
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
