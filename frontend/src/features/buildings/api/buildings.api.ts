import { api } from "@/api/client";

export async function upgradeBuilding(payload: {
  buildingId: string;
  cityId: string;
  level: number;
}) {
  const response = await api.post("/api/v1/building/upgrade", payload);
  return response.data.data;
}
