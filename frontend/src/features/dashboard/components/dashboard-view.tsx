"use client";

import {
  BuildingsList,
  useBuildingRealtime,
  useBuildings,
  useUpgradeBuilding,
} from "@/features/buildings";
import { CityCard } from "@/features/city";
import { ResourcesPanel } from "@/features/resources";
import axios from "axios";
import { DashboardHeader } from "./dashboard-header";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message;

    if (message === "NO_PLAYER") {
      return "No player found. Create a player to enter the game.";
    }

    if (message === "NO_CITY") {
      return "No city found. Found your city to continue.";
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Failed to load dashboard.";
}

export function DashboardView() {
  const { data, buildings, cityId, isLoading, isError, error } =
    useBuildings();
  const {
    handleUpgrade,
    upgradingBuildingId,
    error: upgradeError,
    clearError,
  } = useUpgradeBuilding(cityId);

  useBuildingRealtime({
    playerId: data?.player.id,
    worldId: data?.player.worldId,
  });

  if (isLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (isError || !data) {
    return <p role="alert">{getErrorMessage(error)}</p>;
  }

  return (
    <main style={{ padding: "24px", maxWidth: "640px" }}>
      <DashboardHeader data={data} />
      <CityCard city={data.city} />
      <ResourcesPanel
        amounts={data.resources}
        production={data.city.production}
      />
      {upgradeError ? (
        <p role="alert">
          {upgradeError}{" "}
          <button type="button" onClick={clearError}>
            Dismiss
          </button>
        </p>
      ) : null}
      <BuildingsList
        buildings={buildings}
        cityId={cityId}
        onUpgrade={handleUpgrade}
        upgradingBuildingId={upgradingBuildingId}
      />
    </main>
  );
}
