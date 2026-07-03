import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
