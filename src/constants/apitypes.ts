import { paths, components } from "@/types/api";

//automatically generated from types from provided api using openapi-typescript to ease the typing process
export type Camera = components["schemas"]["Camera"];

export type TagsResponse =
  paths["/tags/"]["get"]["responses"]["200"]["content"]["application/json"];

export type getCameraByIdParams =
  paths["/cameras/{camera_id}"]["get"]["parameters"]["path"];
export type getCamerasParams = paths["/cameras/"]["get"]["parameters"]["query"];
export type getCamerasResponse =
  paths["/cameras/"]["get"]["responses"]["200"]["content"]["application/json"];
export type updateCameraResponse =
  paths["/cameras/{camera_id}"]["put"]["responses"]["200"]["content"]["application/json"];
export type updateCameraRequest =
  paths["/cameras/{camera_id}"]["put"]["requestBody"]["content"]["application/json"];

export type getCameraByIdResponse =
  paths["/cameras/{camera_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type updateDemoGraphicsRequest =
  paths["/demographics/config/{config_id}"]["put"]["requestBody"]["content"]["application/json"];
export type updateDemoGraphicsResponse =
  paths["/demographics/config/{config_id}"]["put"]["responses"]["200"]["content"]["application/json"];

export type getDemoGraphicsResultsParams =
  paths["/demographics/results"]["get"]["parameters"]["query"];
export type getDemoGraphicsResultsResponse =
  paths["/demographics/results"]["get"]["responses"]["200"]["content"]["application/json"];

export type AgeEnum = components["schemas"]["AgeEnum"];
export type GenderEnum = components["schemas"]["GenderEnum"];
export type EmotionEnum = components["schemas"]["EmotionEnum"];
export type EthnicGroupEnum = components["schemas"]["EthnicGroupEnum"];
