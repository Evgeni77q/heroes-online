import { api } from "@/api/client";
import { DashboardData } from "../types/dashboard.types";

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get("/api/v1/dashboard");
  return response.data.data;
}
