/** Modular building part IDs — reusable Lego kit across castle levels. */
export const CASTLE_PART_IDS = [
  "main_keep",
  "gate",
  "wall_straight",
  "wall_corner",
  "watch_tower",
  "banner",
  "flagpole",
  "torch_gate",
  "torch_tower",
  "torch_keep",
  "main_stairs",
  "bridge",
  "inner_courtyard",
  "fountain",
] as const;

export type CastlePartId = (typeof CASTLE_PART_IDS)[number];

export type CompositionAnchor = "center" | "center-bottom";

export interface CompositionPartDef {
  id: string;
  label: string;
  /** Position inside the composition footprint (top-left origin). */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scale?: number;
  zIndex: number;
  /** `/assets/city/castle/parts/{id}.png` when the part asset ships. */
  assetSrc?: string;
}

export interface BuildingComposition {
  id: string;
  level: number;
  footprint: { width: number; height: number };
  anchor: CompositionAnchor;
  /**
   * Whole-building fallback until every required part has its own asset.
   * Removed once all `requiredPartIds` have shipped PNGs.
   */
  compositeFallbackSrc?: string;
  /** Part IDs that must ship before composite fallback is disabled. */
  requiredPartIds?: readonly string[];
  renderMode: "composite" | "parts";
  parts: CompositionPartDef[];
}

import { castleSharedPartSrc } from "../config/city-assets.config";

export function castlePartAssetPath(partId: string): string | undefined {
  return castleSharedPartSrc(partId);
}

export function compositionUsesCompositeFallback(
  composition: BuildingComposition,
): boolean {
  if (composition.renderMode === "composite") {
    return Boolean(composition.compositeFallbackSrc);
  }

  if (!composition.compositeFallbackSrc) {
    return false;
  }

  const requiredIds =
    composition.requiredPartIds ?? composition.parts.map((part) => part.id);

  const allRequiredReady = requiredIds.every((partId) => {
    const part = composition.parts.find((candidate) => candidate.id === partId);

    return Boolean(part?.assetSrc);
  });

  return !allRequiredReady;
}
