"use client";
import type { DemographicsConfig } from "@/types/camera";
import { UpdateDemographicModal } from "./update-demographic";

function DemographicsConfig({ data }: { data: DemographicsConfig }) {
  const {
    track_history_max_length,
    exit_threshold,
    min_track_duration,
    detection_confidence_threshold,
    demographics_confidence_threshold,
    min_track_updates,
    box_area_threshold,
    save_interval,
    frame_skip_interval,
  } = data;
  const demographicData = [
    {
      label: "Track History",
      value: track_history_max_length,
    },
    {
      label: "Exit Threshold",
      value: exit_threshold,
    },
    {
      label: "Min Track Duration",
      value: min_track_duration,
    },
    {
      label: "Detection Confidence",
      value: (detection_confidence_threshold * 100).toFixed(1) + "%",
    },
    {
      label: "Demographics Confidence",
      value: (demographics_confidence_threshold * 100).toFixed(1) + "%",
    },
    {
      label: "Min Track Updates",
      value: min_track_updates,
    },
    {
      label: "Box Area Threshold",
      value: box_area_threshold,
    },
    {
      label: "Save Interval",
      value: save_interval,
    },
    {
      label: "Frame Skip Interval",
      value: frame_skip_interval,
    },
  ];
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Demographics Configuration
        </h2>
        <UpdateDemographicModal
          data={{
            track_history_max_length,
            exit_threshold,
            min_track_duration,
            detection_confidence_threshold,
            demographics_confidence_threshold,
            min_track_updates,
            box_area_threshold,
            save_interval,
            frame_skip_interval,
          }}
          id={data.id}
          cameraId={data.camera_id}
          type={data.id ? "update" : "create"}
        />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {demographicData.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        {/* <div className="pt-2 text-xs text-gray-500">
          <p>Config ID: {data.id}</p>
          <p>Last updated: {formatDate(data.updated_at)}</p>
        </div> */}
      </div>
    </div>
  );
}

export default DemographicsConfig;
