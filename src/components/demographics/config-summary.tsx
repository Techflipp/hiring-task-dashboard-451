import { DemographicsConfig } from "@/types";
import {
  DescriptionList,
  DescriptionListItem,
} from "@/components/ui/description-list";

interface ConfigSummaryProps {
  config: DemographicsConfig;
}

export function ConfigSummary({ config }: ConfigSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Tracking Configuration
        </h4>
        <DescriptionList className="lg:grid-cols-3">
          <DescriptionListItem
            label="Track History Max"
            value={config.track_history_max_length || "Default"}
          />
          <DescriptionListItem
            label="Exit Threshold"
            value={config.exit_threshold || "Default"}
          />
          <DescriptionListItem
            label="Min Track Duration"
            value={
              config.min_track_duration
                ? `${config.min_track_duration}s`
                : "Default"
            }
          />
          <DescriptionListItem
            label="Min Track Updates"
            value={config.min_track_updates || "Default"}
          />
        </DescriptionList>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Detection Configuration
        </h4>
        <DescriptionList className="lg:grid-cols-3">
          <DescriptionListItem
            label="Detection Confidence"
            value={config.detection_confidence_threshold || "Default"}
          />
          <DescriptionListItem
            label="Demographics Confidence"
            value={config.demographics_confidence_threshold || "Default"}
          />
          <DescriptionListItem
            label="Box Area Threshold"
            value={config.box_area_threshold || "Default"}
          />
        </DescriptionList>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Performance Configuration
        </h4>
        <DescriptionList className="lg:grid-cols-3">
          <DescriptionListItem
            label="Save Interval"
            value={
              config.save_interval ? `${config.save_interval}s` : "Default"
            }
          />
          <DescriptionListItem
            label="Frame Skip Interval"
            value={
              config.frame_skip_interval
                ? `${config.frame_skip_interval}s`
                : "Default"
            }
          />
        </DescriptionList>
      </div>
    </div>
  );
}
