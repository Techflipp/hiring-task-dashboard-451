"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemographicsConfig } from "@/types";
import {
  DemographicsConfigFormData,
  DemographicsConfigUpdateFormData,
  demographicsConfigSchema,
  demographicsConfigUpdateSchema,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Info } from "lucide-react";
import { FormField } from "../ui/form-filed";

interface DemographicsConfigFormProps {
  cameraId?: string;
  config?: DemographicsConfig;
  onSubmit: (
    data: DemographicsConfigFormData | DemographicsConfigUpdateFormData
  ) => Promise<void>;
  isSubmitting?: boolean;
}

const configFields = [
  {
    name: "track_history_max_length",
    label: "Track History Max Length",
    description: "Maximum number of frames to keep in tracking history",
    min: 1,
    max: 100,
    defaultValue: 30,
  },
  {
    name: "exit_threshold",
    label: "Exit Threshold",
    description: "Number of frames before considering a person has exited",
    min: 1,
    max: 300,
    defaultValue: 100,
  },
  {
    name: "min_track_duration",
    label: "Min Track Duration (seconds)",
    description: "Minimum duration to consider a valid track",
    min: 1,
    max: 60,
    defaultValue: 5,
  },
  {
    name: "detection_confidence_threshold",
    label: "Detection Confidence Threshold",
    description: "Minimum confidence score for person detection",
    min: 0.1,
    max: 1.0,
    step: 0.1,
    defaultValue: 0.5,
  },
  {
    name: "demographics_confidence_threshold",
    label: "Demographics Confidence Threshold",
    description: "Minimum confidence score for demographic attributes",
    min: 0.1,
    max: 1.0,
    step: 0.1,
    defaultValue: 0.5,
  },
  {
    name: "min_track_updates",
    label: "Min Track Updates",
    description: "Minimum number of updates for a valid track",
    min: 1,
    max: 100,
    defaultValue: 10,
  },
  {
    name: "box_area_threshold",
    label: "Box Area Threshold",
    description: "Minimum bounding box area ratio",
    min: 0.05,
    max: 1.0,
    step: 0.05,
    defaultValue: 0.1,
  },
  {
    name: "save_interval",
    label: "Save Interval (seconds)",
    description: "How often to save demographic results",
    min: 300,
    max: 1800,
    defaultValue: 600,
  },
  {
    name: "frame_skip_interval",
    label: "Frame Skip Interval",
    description: "Process every nth frame for performance",
    min: 0.1,
    max: 5.0,
    step: 0.1,
    defaultValue: 1.0,
  },
];

export function DemographicsConfigForm({
  cameraId,
  config,
  onSubmit,
  isSubmitting,
}: DemographicsConfigFormProps) {
  const isUpdate = !!config;
  const schema = isUpdate
    ? demographicsConfigUpdateSchema
    : demographicsConfigSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicsConfigFormData | DemographicsConfigUpdateFormData>({
    resolver: zodResolver(schema),
    defaultValues: isUpdate
      ? {
          track_history_max_length: config.track_history_max_length,
          exit_threshold: config.exit_threshold,
          min_track_duration: config.min_track_duration,
          detection_confidence_threshold: config.detection_confidence_threshold,
          demographics_confidence_threshold:
            config.demographics_confidence_threshold,
          min_track_updates: config.min_track_updates,
          box_area_threshold: config.box_area_threshold,
          save_interval: config.save_interval,
          frame_skip_interval: config.frame_skip_interval,
        }
      : {
          camera_id: cameraId,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demographics Configuration</CardTitle>
          <CardDescription>
            Configure how demographic data is collected and processed for this
            camera
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {!isUpdate && (
              <input
                type="hidden"
                {...register("camera_id" as keyof DemographicsConfigFormData)}
                value={cameraId}
              />
            )}

            {configFields.map((field) => {
              const fieldName = field.name as keyof (
                | DemographicsConfigFormData
                | DemographicsConfigUpdateFormData
              );
              const error = errors[fieldName];

              return (
                <FormField
                  key={field.name}
                  label={field.label}
                  error={error?.message}>
                  <div className="space-y-1">
                    <Input
                      {...register(fieldName, {
                        valueAsNumber: true,
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                      type="number"
                      placeholder={String(field.defaultValue)}
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                    />
                    <p className="text-xs text-gray-500 flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {field.description}
                    </p>
                  </div>
                </FormField>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Saving..."
            : isUpdate
            ? "Update Configuration"
            : "Create Configuration"}
        </Button>
      </div>
    </form>
  );
}
