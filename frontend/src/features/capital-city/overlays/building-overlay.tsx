"use client";

import { useEffect, useState } from "react";
import {
  BUILDING_ICONS,
  BUILDING_LABELS,
  BuildingView,
} from "@/features/buildings/types/building.types";
import type { DashboardArmy } from "@/features/army/types/army.types";
import {
  BuildingOverlayTabDef,
  BuildingOverlayTabId,
  getBuildingOverlayTabs,
} from "../config/building-overlay.config";
import { BuildingFunctionTab } from "./tabs/building-function-tab";
import { BuildingInfoTab } from "./tabs/building-info-tab";
import { BuildingRecruitTab } from "./tabs/building-recruit-tab";
import { BuildingUpgradeTab } from "./tabs/building-upgrade-tab";

const FUNCTION_TAB_IDS = new Set<BuildingOverlayTabId>([
  "PRODUCTION",
  "STORAGE",
  "ECONOMY",
  "HEAL",
  "MARCHES",
  "DEFENSE",
  "CRAFT",
  "RESEARCH",
  "TRAIN",
]);

function renderTabContent(
  tab: BuildingOverlayTabDef,
  building: BuildingView,
  cityId: string | undefined,
  army: DashboardArmy | undefined,
  onUpgrade: ((building: BuildingView) => void) | undefined,
  isUpgrading: boolean,
) {
  switch (tab.id) {
    case "INFO":
      return <BuildingInfoTab building={building} />;
    case "RECRUIT":
      return <BuildingRecruitTab building={building} cityId={cityId} />;
    case "UPGRADE":
      return (
        <BuildingUpgradeTab
          building={building}
          cityId={cityId}
          onUpgrade={onUpgrade}
          isUpgrading={isUpgrading}
        />
      );
    default:
      if (FUNCTION_TAB_IDS.has(tab.id)) {
        if (tab.id === "MARCHES" && army) {
          return (
            <div style={{ display: "grid", gap: "16px" }}>
              <BuildingFunctionTab tabId={tab.id} tabLabel={tab.label} />
              <div style={{ color: "#e2e8f0", fontSize: "14px" }}>
                <strong>March Capacity</strong>
                <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: 700 }}>
                  {army.troopsCommanded} / {army.marchCapacity}
                </p>
              </div>
            </div>
          );
        }

        return <BuildingFunctionTab tabId={tab.id} tabLabel={tab.label} />;
      }

      return null;
  }
}

export function BuildingOverlay({
  building,
  cityId,
  army,
  onClose,
  onUpgrade,
  isUpgrading,
}: {
  building: BuildingView;
  cityId?: string;
  army?: DashboardArmy;
  onClose: () => void;
  onUpgrade?: (building: BuildingView) => void;
  isUpgrading?: boolean;
}) {
  const tabs = getBuildingOverlayTabs(building.type);
  const [activeTabId, setActiveTabId] = useState<BuildingOverlayTabId>(tabs[0]!.id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]!;

  useEffect(() => {
    setActiveTabId(getBuildingOverlayTabs(building.type)[0]!.id);
  }, [building.id, building.type]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${BUILDING_LABELS[building.type]} building`}
      className="premium-overlay-backdrop"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="premium-card premium-overlay-panel"
        style={{ color: "var(--premium-text)", overflow: "hidden" }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "28px",
                width: "52px",
                height: "52px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              aria-hidden
            >
              {BUILDING_ICONS[building.type]}
            </span>
            <div style={{ display: "grid", gap: "4px" }}>
              <p className="premium-section-kicker">{BUILDING_LABELS[building.type]}</p>
              <h2 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "-0.04em" }}>
                {BUILDING_LABELS[building.type].toUpperCase()}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--premium-text-soft)",
                }}
              >
                Level {building.level}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close building overlay"
            className="premium-button premium-button--secondary"
            style={{
              width: "40px",
              height: "40px",
              padding: 0,
              fontSize: "20px",
            }}
          >
            ×
          </button>
        </header>

        <nav
          aria-label="Building tabs"
          style={{
            display: "flex",
            gap: "4px",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => {
            const active = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                aria-selected={active}
                style={{
                  padding: "12px 16px",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--premium-gold)"
                    : "2px solid transparent",
                  background: "transparent",
                  color: active ? "var(--premium-text)" : "var(--premium-text-soft)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {renderTabContent(
            activeTab,
            building,
            cityId,
            army,
            onUpgrade,
            isUpgrading ?? false,
          )}
        </div>
      </div>
    </div>
  );
}
