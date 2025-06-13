import axios from "axios";
import https from "https";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
