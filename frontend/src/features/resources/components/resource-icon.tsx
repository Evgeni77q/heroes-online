import { ResourceType } from "../types/resource.types";

const RESOURCE_ICONS: Record<ResourceType, string> = {
  wood: "🌲",
  stone: "🪨",
  gold: "🪙",
  food: "🌾",
};

export function ResourceIcon({ type }: { type: ResourceType }) {
  return (
    <span aria-hidden="true" style={{ width: "1.5rem", display: "inline-block" }}>
      {RESOURCE_ICONS[type]}
    </span>
  );
}

export function getResourceIcon(type: ResourceType): string {
  return RESOURCE_ICONS[type];
}
