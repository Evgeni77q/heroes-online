import {
  BUILDING_ICONS,
  BUILDING_LABELS,
  BuildingView,
} from "../types/building.types";
import { BuildingLevel } from "./building-level";
import { BuildingStatusView } from "./building-status";
import { UpgradeButton } from "./upgrade-button";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  display: "grid",
  gap: "12px",
} as const;

export function BuildingCard({
  building,
  cityId,
  onUpgrade,
  isUpgrading = false,
}: {
  building: BuildingView;
  cityId?: string;
  onUpgrade?: (building: BuildingView) => void;
  isUpgrading?: boolean;
}) {
  return (
    <article style={cardStyle}>
      <h3>
        {BUILDING_ICONS[building.type]} {BUILDING_LABELS[building.type]}
      </h3>
      <BuildingLevel building={building} />
      <BuildingStatusView building={building} />
      <UpgradeButton
        building={building}
        cityId={cityId}
        onUpgrade={onUpgrade}
        isLoading={isUpgrading}
      />
    </article>
  );
}
