import * as yup from "yup";

export const cameraUpdateSchema = yup.object({
  name: yup
    .string()
    .required("Camera name is required")
    .min(2, "Camera name must be at least 2 characters")
    .max(100, "Camera name must be less than 100 characters"),
  rtsp_url: yup
    .string()
    .required("RTSP URL is required")
    .matches(/^rtsp:\/\//, "URL must start with rtsp://"),
  stream_frame_width: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(1, "Frame width must be at least 1")
    .max(2560, "Frame width must be at most 2560"),
  stream_frame_height: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(1, "Frame height must be at least 1")
    .max(2560, "Frame height must be at most 2560"),
  stream_max_length: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0, "Max length must be at least 0"),
  stream_quality: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(80, "Quality must be at least 80")
    .max(100, "Quality must be at most 100"),
  stream_fps: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(1, "FPS must be at least 1")
    .max(120, "FPS must be at most 120"),
  stream_skip_frames: yup
    .number()
    .nullable()
    .optional()
    .transform((value) => (isNaN(value) || value === "" ? null : value))
    .min(0, "Skip frames must be at least 0")
    .max(100, "Skip frames must be at most 100"),
});
