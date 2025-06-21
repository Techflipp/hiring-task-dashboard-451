import { createDemographicsConfig, updateDemographicsConfig } from "@/app/services/demographics";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
type DemographicsConfig = {
  id: string;
  track_history_max_length: number;
  exit_threshold: number;
  min_track_duration: number;
  detection_confidence_threshold: number;
  demographics_confidence_threshold: number;
  min_track_updates: number;
  box_area_threshold: number;
  save_interval: number;
  frame_skip_interval: number;
};
type Props = {
  cameraId: string;
  existingConfig?: DemographicsConfig; // ✅ نجعلها اختيارية
};
export default function CameraDemographicsConfigForm({ cameraId, existingConfig }: Props) {
  const [form, setForm] = useState({
    track_history_max_length: existingConfig?.track_history_max_length || 0,
    exit_threshold: existingConfig?.exit_threshold || 0,
    min_track_duration: existingConfig?.min_track_duration || 0,
    detection_confidence_threshold: existingConfig?.detection_confidence_threshold || 0,
    demographics_confidence_threshold: existingConfig?.demographics_confidence_threshold || 0,
    min_track_updates: existingConfig?.min_track_updates || 0,
    box_area_threshold: existingConfig?.box_area_threshold || 0,
    save_interval: existingConfig?.save_interval || 0,
    frame_skip_interval: existingConfig?.frame_skip_interval || 0,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: existingConfig
      ? () => updateDemographicsConfig(existingConfig.id, form)
      : () => createDemographicsConfig({ camera_id: cameraId, ...form }),
    onSuccess: () => {
      toast.success("Configuration saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["camera", cameraId] });
    },
    onError: () => toast.error("Error saving configuration"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("threshold") || name.includes("interval") || name.includes("confidence") ? parseFloat(value) : parseInt(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(form).map(([key, val]) => (
        <div key={key} className="flex flex-col">
          <label className="capitalize">{key.replace(/_/g, " ")}:</label>
          <input type="number" name={key} value={val} onChange={handleChange} className="border rounded p-2" step="any" min="0" required />
        </div>
      ))}

      <div className="md:col-span-2">
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {existingConfig ? "Update" : "Create"} Configuration
        </button>
      </div>
    </form>
  );
}
