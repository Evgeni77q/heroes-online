"use client";

import { BuildingOverlayTabId } from "../../config/building-overlay.config";

const TAB_DESCRIPTIONS: Partial<Record<BuildingOverlayTabId, string>> = {
  PRODUCTION: "Production details and output bonuses will live here.",
  STORAGE: "Storage capacity and goods overview will live here.",
  ECONOMY: "Silver income and economic bonuses will live here.",
  HEAL: "Troop recovery queue and healing actions will live here.",
  MARCHES: "March capacity and active expeditions will live here.",
  DEFENSE: "Traps, towers, and city defense will live here.",
  CRAFT: "Weapon and armor crafting will live here.",
  RESEARCH: "Technology trees and research progress will live here.",
  TRAIN: "Army drills and military bonuses will live here.",
};

export function BuildingFunctionTab({
  tabId,
  tabLabel,
}: {
  tabId: BuildingOverlayTabId;
  tabLabel: string;
}) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <p style={{ margin: 0, color: "#cbd5e0", fontSize: "14px" }}>
        {TAB_DESCRIPTIONS[tabId] ??
          `${tabLabel} functionality will be wired here.`}
      </p>
      <div
        style={{
          border: "1px dashed #4a5568",
          borderRadius: "8px",
          padding: "24px",
          color: "#718096",
          textAlign: "center",
          fontSize: "13px",
        }}
      >
        {tabLabel} — shell ready
      </div>
    </div>
  );
}
