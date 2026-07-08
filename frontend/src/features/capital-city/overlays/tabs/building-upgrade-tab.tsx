"use client";

import { UpgradeButton } from "@/features/buildings/components/upgrade-button";
import { BuildingView } from "@/features/buildings/types/building.types";

export function BuildingUpgradeTab({
  building,
  cityId,
  onUpgrade,
  isUpgrading,
}: {
  building: BuildingView;
  cityId?: string;
  onUpgrade?: (building: BuildingView) => void;
  isUpgrading?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <p style={{ margin: 0, color: "#cbd5e0", fontSize: "14px" }}>
        Upgrade this building to increase its level and unlock stronger bonuses.
      </p>
      {building.unlockLabel ? (
        <p style={{ margin: 0, fontSize: "13px", color: "#a0aec0" }}>
          Unlock: {building.unlockLabel}
        </p>
      ) : null}
      <UpgradeButton
        building={building}
        cityId={cityId}
        onUpgrade={onUpgrade}
        isLoading={isUpgrading}
      />
    </div>
  );
}
