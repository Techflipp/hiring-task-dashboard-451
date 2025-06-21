import API from "../axios/axios";

export const getTags = async () => {
  const res = await API.get("/tags");
  return res.data;
};
