import * as yup from "yup";

export const demographicsResultsSchema = yup.object({
  camera_id: yup.string().required("Camera selection is required"),
  gender: yup.string().nullable().optional(),
  age: yup.string().nullable().optional(),
  emotion: yup.string().nullable().optional(),
  ethnicity: yup.string().nullable().optional(),
  start_date: yup.string().nullable().optional(),
  end_date: yup.string().nullable().optional(),
});

export type DemographicsResultsFormData = yup.InferType<
  typeof demographicsResultsSchema
>;
