"use client";

import { BuildingRecruitPanel } from "@/features/army/components/building-recruit-panel";
import { BUILDING_RECRUIT_CONFIG } from "@/features/army/config/building-recruit.config";
import {
  BuildingStatus,
  BuildingView,
} from "@/features/buildings/types/building.types";

export function BuildingRecruitTab({
  building,
  cityId,
}: {
  building: BuildingView;
  cityId?: string;
}) {
  const recruitConfig = BUILDING_RECRUIT_CONFIG[building.type];
  const isRecruitBuildingBuilt =
    building.level > 0 &&
    building.status !== BuildingStatus.Locked &&
    building.status !== BuildingStatus.NotBuilt;

  if (!recruitConfig) {
    return (
      <p style={{ margin: 0, color: "#a0aec0" }}>
        Recruitment is not available for this building.
      </p>
    );
  }

  if (!isRecruitBuildingBuilt) {
    return (
      <p style={{ margin: 0, color: "#a0aec0" }}>
        Build this building first to unlock recruitment.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <p style={{ margin: 0, color: "#cbd5e0", fontSize: "14px" }}>
        Select a unit line and recruit troops for your army.
      </p>
      <div
        style={{
          border: "1px solid #4a5568",
          borderRadius: "8px",
          padding: "16px",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#e2e8f0" }}>
          Tier I — {recruitConfig.buttonLabel.replace("Recruit ", "")}
        </p>
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#a0aec0" }}>
          Additional tiers will appear here as the army system expands.
        </p>
        <BuildingRecruitPanel
          unitType={recruitConfig.unitType}
          buttonLabel={recruitConfig.buttonLabel}
          cityId={cityId}
          enabled
        />
      </div>
    </div>
  );
}
