"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { connectSocket, socket } from "@/websocket/socket";
import {
  BuildingStatus,
  BuildingUpdatedEventV1,
} from "../types/building.types";
import { useBuildingsStore } from "../store/buildings.store";

function isBuildingUpdatedEvent(
  value: unknown,
): value is BuildingUpdatedEventV1 {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as BuildingUpdatedEventV1;

  return (
    event.event === "building.updated" &&
    event.version === 1 &&
    typeof event.payload?.buildingId === "string"
  );
}

export function useBuildingRealtime({
  playerId,
  worldId,
}: {
  playerId?: string;
  worldId?: string;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateBuilding = useBuildingsStore((state) => state.updateBuilding);

  useEffect(() => {
    if (!playerId || !worldId || !accessToken) {
      return;
    }

    connectSocket(accessToken);
    socket.emit("join_world", { playerId, worldId });

    const onBuildingUpdated = (message: unknown) => {
      if (!isBuildingUpdatedEvent(message)) {
        return;
      }

      updateBuilding(message.payload.buildingId, {
        level: message.payload.level,
        status: message.payload.status as BuildingStatus,
        upgradeCost: message.payload.upgradeCost,
        finishAt: null,
      });
    };

    socket.on("building.updated", onBuildingUpdated);

    return () => {
      socket.off("building.updated", onBuildingUpdated);
    };
  }, [accessToken, playerId, updateBuilding, worldId]);
}
