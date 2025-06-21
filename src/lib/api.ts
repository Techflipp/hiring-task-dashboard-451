import axios from "axios";

export const api = axios.create({
  baseURL: "https://task-451-api.ryd.wafaicloud.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
