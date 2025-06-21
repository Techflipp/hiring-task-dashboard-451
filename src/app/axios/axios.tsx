import axios from "axios";

const API = axios.create({
  baseURL: "https://task-451-api.ryd.wafaicloud.com",
});

export default API;
