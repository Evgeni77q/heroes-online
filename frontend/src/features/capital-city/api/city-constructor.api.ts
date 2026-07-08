import { api } from "@/api/client";
import { unwrapApiData } from "@/api/unwrap";
import { CityConstructorView } from "../types/city-constructor.types";

export async function getCityConstructor(): Promise<CityConstructorView> {
  const response = await api.get("/api/v1/capital-city/constructor");
  return unwrapApiData<CityConstructorView>(response);
}

export async function moveBuildingPlacement(
  buildingId: string,
  slotIndex: number,
): Promise<CityConstructorView> {
  const response = await api.patch("/api/v1/capital-city/constructor/placements", {
    buildingId,
    slotIndex,
  });
  return unwrapApiData<CityConstructorView>(response);
}
