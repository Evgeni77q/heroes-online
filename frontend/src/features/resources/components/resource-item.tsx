import { RESOURCE_LABELS } from "../types/resource.types";
import { ResourceItemData } from "../types/resource.types";
import { ResourceIcon } from "./resource-icon";
import {
  formatProductionRate,
  formatResourceAmount,
} from "../utils/format-resource";

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto auto",
  gap: "12px",
  alignItems: "center",
} as const;

export function ResourceItem({
  type,
  amount,
  productionPerMinute,
}: ResourceItemData) {
  return (
    <div style={rowStyle}>
      <ResourceIcon type={type} />
      <span>{RESOURCE_LABELS[type]}</span>
      <span>{formatResourceAmount(amount)}</span>
      <span>({formatProductionRate(productionPerMinute)})</span>
    </div>
  );
}
