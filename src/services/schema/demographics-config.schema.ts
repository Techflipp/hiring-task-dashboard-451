import * as yup from "yup";

export const demographicsConfigSchema = yup.object({
  track_history_max_length: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(1, "Track history max length must be at least 1")
    .max(10000, "Track history max length must be at most 10000"),
  exit_threshold: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.1, "Exit threshold must be at least 0.1 seconds")
    .max(300, "Exit threshold must be at most 300 seconds"),
  min_track_duration: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.1, "Min track duration must be at least 0.1 seconds")
    .max(300, "Min track duration must be at most 300 seconds"),
  detection_confidence_threshold: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.1, "Detection confidence threshold must be at least 0.1")
    .max(1.0, "Detection confidence threshold must be at most 1.0"),
  demographics_confidence_threshold: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.1, "Demographics confidence threshold must be at least 0.1")
    .max(1.0, "Demographics confidence threshold must be at most 1.0"),
  min_track_updates: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(1, "Min track updates must be at least 1")
    .max(1000, "Min track updates must be at most 1000"),
  box_area_threshold: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.01, "Box area threshold must be at least 0.01")
    .max(1.0, "Box area threshold must be at most 1.0"),
  save_interval: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(300, "Save interval must be at least 300 seconds (5 minutes)")
    .max(1800, "Save interval must be at most 1800 seconds (30 minutes)"),
  frame_skip_interval: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0.1, "Frame skip interval must be at least 0.1 seconds")
    .max(3600, "Frame skip interval must be at most 3600 seconds"),
});
