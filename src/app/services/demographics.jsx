// services/demographics.ts
"use client";
import API from "../axios/axios";

export const getDemographicsResults = async (filters) => {
  // remove empty values
  const cleanedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ""));

  const res = await API.get("/demographics/results", {
    params: cleanedFilters,
  });

  return res.data;
};

export const createDemographicsConfig = async (payload) => {
  const res = await API.post("/demographics/config", payload);
  return res.data;
};

export const updateDemographicsConfig = async (id, payload) => {
  const res = await API.put(`/demographics/config/${id}`, payload);
  return res.data;
};

export const getDemographicsConfig = async (cameraId) => {
  const res = await API.get(`/cameras/${cameraId}`);
  console.log("res", res?.data);

  return res.data;
};
