import { paths, components } from "@/types/api";

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
