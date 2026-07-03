import { BuildingView } from "../types/building.types";
import { BuildingCard } from "./building-card";

const listStyle = {
  marginTop: "24px",
  display: "grid",
  gap: "16px",
} as const;

export function BuildingsList({
  buildings,
  cityId,
  onUpgrade,
  upgradingBuildingId,
}: {
  buildings: BuildingView[];
  cityId?: string;
  onUpgrade?: (building: BuildingView) => void;
  upgradingBuildingId?: string | null;
}) {
  return (
    <section style={listStyle}>
      <h2>Buildings</h2>

      {buildings.map((building) => (
        <BuildingCard
          key={building.id}
          building={building}
          cityId={cityId}
          onUpgrade={onUpgrade}
          isUpgrading={upgradingBuildingId === building.id}
        />
      ))}
    </section>
  );
}
