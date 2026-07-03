export type ResourceType = "wood" | "stone" | "gold" | "food";

export type ResourceAmounts = Record<ResourceType, number>;

export const RESOURCE_TYPES: ResourceType[] = [
  "wood",
  "stone",
  "gold",
  "food",
];

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  wood: "Wood",
  stone: "Stone",
  gold: "Gold",
  food: "Food",
};

export interface ResourceItemData {
  type: ResourceType;
  amount: number;
  productionPerMinute: number;
}

export interface ResourcesPanelProps {
  amounts: ResourceAmounts;
  production: ResourceAmounts;
}
