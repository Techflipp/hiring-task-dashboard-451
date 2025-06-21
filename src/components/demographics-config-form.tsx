"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useDemographicsConfigCreate,
  useDemographicsConfigUpdate,
} from "@/hooks/use-demographics-config";
import type { components } from "@/services/api/types";
import { ArrowLeft, Save, X } from "lucide-react";
import { demographicsConfigSchema } from "@/services/schema/demographics-config.schema";

type DemographicsConfig = components["schemas"]["DemographicsConfig"];
type DemographicsConfigCreate =
  components["schemas"]["DemographicsConfigCreate"];
type DemographicsConfigUpdate =
  components["schemas"]["DemographicsConfigUpdate"];

interface DemographicsConfigFormProps {
  cameraId: string;
  existingConfig?: DemographicsConfig | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function DemographicsConfigForm({
  cameraId,
  existingConfig,
  onCancel,
  onSuccess,
}: DemographicsConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(demographicsConfigSchema),
    defaultValues: {
      track_history_max_length:
        existingConfig?.track_history_max_length ?? null,
      exit_threshold: existingConfig?.exit_threshold ?? null,
      min_track_duration: existingConfig?.min_track_duration ?? null,
      detection_confidence_threshold:
        existingConfig?.detection_confidence_threshold ?? null,
      demographics_confidence_threshold:
        existingConfig?.demographics_confidence_threshold ?? null,
      min_track_updates: existingConfig?.min_track_updates ?? null,
      box_area_threshold: existingConfig?.box_area_threshold ?? null,
      save_interval: existingConfig?.save_interval ?? null,
      frame_skip_interval: existingConfig?.frame_skip_interval ?? null,
    },
  });

  const createMutation = useDemographicsConfigCreate();
  const updateMutation = useDemographicsConfigUpdate();

  const onSubmit = async (data: DemographicsConfigUpdate) => {
    if (existingConfig) {
      await updateMutation.mutateAsync({
        configId: existingConfig.id,
        data,
      });
    } else {
      const createData: DemographicsConfigCreate = {
        ...data,
        camera_id: cameraId,
      };
      await createMutation.mutateAsync(createData);
    }

    onSuccess?.();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Camera Details
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-6">
              {existingConfig ? "Edit" : "Create"} Demographics Configuration
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Track History Max Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Track History Max Length
                  </label>
                  <input
                    {...register("track_history_max_length")}
                    type="number"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.track_history_max_length
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Maximum detection records to keep"
                    disabled={isLoading}
                  />
                  {errors.track_history_max_length && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.track_history_max_length.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum number of detection records to keep for tracking one
                    person
                  </p>
                </div>

                {/* Exit Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Exit Threshold (seconds)
                  </label>
                  <input
                    {...register("exit_threshold")}
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.exit_threshold
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Time to wait after losing sight"
                    disabled={isLoading}
                  />
                  {errors.exit_threshold && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.exit_threshold.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Time in seconds to wait after losing sight of a person
                    before considering them as exited
                  </p>
                </div>

                {/* Min Track Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Track Duration (seconds)
                  </label>
                  <input
                    {...register("min_track_duration")}
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.min_track_duration
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Minimum track duration"
                    disabled={isLoading}
                  />
                  {errors.min_track_duration && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.min_track_duration.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum track duration in seconds before considering a
                    person for demographics analysis
                  </p>
                </div>

                {/* Detection Confidence Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Detection Confidence Threshold
                  </label>
                  <input
                    {...register("detection_confidence_threshold")}
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.detection_confidence_threshold
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="0.1 to 1.0"
                    disabled={isLoading}
                  />
                  {errors.detection_confidence_threshold && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.detection_confidence_threshold.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum confidence threshold for person detection (0.1 to
                    1.0)
                  </p>
                </div>

                {/* Demographics Confidence Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Demographics Confidence Threshold
                  </label>
                  <input
                    {...register("demographics_confidence_threshold")}
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.demographics_confidence_threshold
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="0.1 to 1.0"
                    disabled={isLoading}
                  />
                  {errors.demographics_confidence_threshold && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.demographics_confidence_threshold.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum confidence threshold for demographics classification
                    (0.1 to 1.0)
                  </p>
                </div>

                {/* Min Track Updates */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Track Updates
                  </label>
                  <input
                    {...register("min_track_updates")}
                    type="number"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.min_track_updates
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Minimum successful detections"
                    disabled={isLoading}
                  />
                  {errors.min_track_updates && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.min_track_updates.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum number of successful detections required before
                    saving demographics data
                  </p>
                </div>

                {/* Box Area Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Box Area Threshold
                  </label>
                  <input
                    {...register("box_area_threshold")}
                    type="number"
                    step="0.01"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.box_area_threshold
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Minimum bounding box area"
                    disabled={isLoading}
                  />
                  {errors.box_area_threshold && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.box_area_threshold.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum bounding box area threshold relative to frame size
                  </p>
                </div>

                {/* Save Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Save Interval (seconds)
                  </label>
                  <input
                    {...register("save_interval")}
                    type="number"
                    step="1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.save_interval
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="300 to 1800 seconds"
                    disabled={isLoading}
                  />
                  {errors.save_interval && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.save_interval.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Time interval in seconds between saving demographics data
                    batches (300-1800 seconds)
                  </p>
                </div>

                {/* Frame Skip Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frame Skip Interval (seconds)
                  </label>
                  <input
                    {...register("frame_skip_interval")}
                    type="number"
                    step="0.1"
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.frame_skip_interval
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                    placeholder="Time interval between processing frames"
                    disabled={isLoading}
                  />
                  {errors.frame_skip_interval && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.frame_skip_interval.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Time interval in seconds between processing frames (higher
                    values reduce processing load)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {isLoading
                    ? "Saving..."
                    : existingConfig
                    ? "Update Configuration"
                    : "Create Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
