"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { upgradeBuilding } from "../api/buildings.api";
import { BuildingStatus, BuildingView } from "../types/building.types";
import { useBuildingsStore } from "../store/buildings.store";

function getUpgradeErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.error?.code;

    if (code === "INSUFFICIENT_RESOURCES") {
      return "Not enough resources for this upgrade.";
    }

    if (code === "ALREADY_UPGRADING") {
      return "This building is already upgrading.";
    }

    if (code === "MAX_LEVEL_REACHED") {
      return "This building has reached maximum level.";
    }

    const message = error.response?.data?.error?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Failed to start upgrade.";
}

export function useUpgradeBuilding(cityId?: string) {
  const updateBuilding = useBuildingsStore((state) => state.updateBuilding);
  const [upgradingBuildingId, setUpgradingBuildingId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = useCallback(
    async (building: BuildingView) => {
      if (!cityId || building.status === BuildingStatus.Locked) {
        return;
      }

      setError(null);
      setUpgradingBuildingId(building.id);

      try {
        const accepted = await upgradeBuilding({
          buildingId: building.id,
          cityId,
        });

        updateBuilding(building.id, {
          status: BuildingStatus.Upgrading,
          finishAt: accepted.finishAt,
        });
      } catch (upgradeError) {
        setError(getUpgradeErrorMessage(upgradeError));
      } finally {
        setUpgradingBuildingId(null);
      }
    },
    [cityId, updateBuilding],
  );

  return {
    handleUpgrade,
    upgradingBuildingId,
    error,
    clearError: () => setError(null),
  };
}
