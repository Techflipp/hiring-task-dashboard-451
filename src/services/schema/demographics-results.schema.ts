import * as yup from "yup";

export type DemographicsResultsFormData = {
  camera_id: string;
  gender?: string;
  age?: string;
  emotion?: string;
  ethnicity?: string;
  start_date?: string;
  end_date?: string;
};

export const demographicsResultsSchema: yup.ObjectSchema<DemographicsResultsFormData> =
  yup.object({
    camera_id: yup.string().required("Camera selection is required"),
    gender: yup.string().optional(),
    age: yup.string().optional(),
    emotion: yup.string().optional(),
    ethnicity: yup.string().optional(),
    start_date: yup.string().optional(),
    end_date: yup.string().optional(),
  });
