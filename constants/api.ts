import { getFromSecureStore } from "@/utils/secureStorage";
import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://express-micro-gateway.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getFromSecureStore("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
