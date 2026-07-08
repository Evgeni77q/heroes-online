"use client";

import { BuildingLevel } from "@/features/buildings/components/building-level";
import { BuildingStatusView } from "@/features/buildings/components/building-status";
import { BuildingView } from "@/features/buildings/types/building.types";

export function BuildingInfoTab({ building }: { building: BuildingView }) {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      {building.description ? (
        <p style={{ margin: 0, color: "#cbd5e0", lineHeight: 1.5 }}>
          {building.description}
        </p>
      ) : null}
      {building.purpose ? (
        <p style={{ margin: 0, color: "#a0aec0", fontSize: "14px" }}>
          {building.purpose}
        </p>
      ) : null}
      <BuildingLevel building={building} />
      {building.workforce ? (
        <div style={{ fontSize: "14px", color: "#e2e8f0" }}>
          <p style={{ margin: "0 0 4px" }}>
            Workers {building.workforce.assigned} / {building.workforce.required}
          </p>
          <p style={{ margin: 0 }}>
            Output {building.workforce.production.effective} /min (
            {building.workforce.production.base} base)
          </p>
        </div>
      ) : null}
      {building.opensGameplay ? (
        <p style={{ margin: 0, fontSize: "13px", color: "#a0aec0" }}>
          Opens: {building.opensGameplay}
        </p>
      ) : null}
      <BuildingStatusView building={building} />
    </div>
  );
}
