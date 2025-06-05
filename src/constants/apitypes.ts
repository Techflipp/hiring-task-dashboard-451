import { paths } from "@/types/api";

export type TagsResponse =
  paths["/tags/"]["get"]["responses"]["200"]["content"]["application/json"];

export type getCameraParams = paths["/cameras/"]["get"]["parameters"]["query"];
export type getCameraResponse =
  paths["/cameras/"]["get"]["responses"]["200"]["content"]["application/json"];
export type updateCameraResponse =
  paths["/cameras/{camera_id}"]["put"]["responses"]["200"]["content"]["application/json"];
export type updateCameraRequest =
  paths["/cameras/{camera_id}"]["put"]["requestBody"]["content"]["application/json"];

export type getCameraByIdResponse =
  paths["/cameras/{camera_id}"]["get"]["responses"]["200"]["content"]["application/json"];
