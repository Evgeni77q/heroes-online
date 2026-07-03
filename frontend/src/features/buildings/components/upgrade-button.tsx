import { formatResourceAmount } from "@/features/resources";
import { BuildingStatus, BuildingType, BuildingView } from "../types/building.types";

export function UpgradeButton({
  building,
  cityId,
  onUpgrade,
  isLoading = false,
}: {
  building: BuildingView;
  cityId?: string;
  onUpgrade?: (building: BuildingView) => void;
  isLoading?: boolean;
}) {
  const isDisabled =
    isLoading ||
    !cityId ||
    building.type === BuildingType.TownHall ||
    building.status === BuildingStatus.Locked ||
    building.status === BuildingStatus.Upgrading;

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <div>
        <p>Upgrade Cost</p>
        <p>
          🌲{formatResourceAmount(building.upgradeCost.wood)}{" "}
          🪨{formatResourceAmount(building.upgradeCost.stone)}{" "}
          🪙{formatResourceAmount(building.upgradeCost.gold)}
        </p>
      </div>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onUpgrade?.(building)}
      >
        {isLoading ? "Upgrading..." : "Upgrade"}
      </button>
    </div>
  );
}
