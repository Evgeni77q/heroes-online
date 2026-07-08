"use client";

import { getBuildingVisualSize } from "../config/building-visual.config";
import { ComposedBuilding } from "../composition/composed-building";
import { getBuildingComposition } from "../composition/get-building-composition";
import { CityConstructorPlacement } from "../types/city-constructor.types";
import type { CitySceneMode } from "./build-plot";

const DRAG_MIME = "application/x-heroes-building-id";

export function setBuildingDragData(
  event: React.DragEvent<HTMLElement>,
  buildingId: string,
) {
  event.dataTransfer.setData(DRAG_MIME, buildingId);
  event.dataTransfer.setData("text/plain", buildingId);
  event.dataTransfer.effectAllowed = "move";
}

export function readBuildingDragData(
  event: React.DragEvent<HTMLElement>,
): string | null {
  return (
    event.dataTransfer.getData(DRAG_MIME) ||
    event.dataTransfer.getData("text/plain") ||
    null
  );
}

interface BuildingBlockProps {
  placement: CityConstructorPlacement;
  mode?: CitySceneMode;
  onDragStart?: (buildingId: string) => void;
  onClick?: () => void;
  selected?: boolean;
}

export function BuildingBlock({
  placement,
  mode = "view",
  onDragStart,
  onClick,
  selected = false,
}: BuildingBlockProps) {
  const isEditMode = mode === "edit";
  const size = getBuildingVisualSize(placement.type);
  const composition = getBuildingComposition(placement.type, placement.level);
  const hasSprite = Boolean(composition);

  return (
    <button
      type="button"
      className={`premium-building-shell${selected ? " premium-building-shell--selected" : ""}`}
      draggable={isEditMode}
      onDragStart={(event) => {
        if (!isEditMode) {
          event.preventDefault();
          return;
        }

        setBuildingDragData(event, placement.buildingId);
        onDragStart?.(placement.buildingId);
      }}
      onClick={onClick}
      title={`${placement.label} · ур. ${placement.level}`}
      style={{
        width: composition?.footprint.width ?? size.width,
        height: composition?.footprint.height ?? size.height,
        padding: hasSprite ? 0 : "8px",
        border: hasSprite
          ? selected
            ? "2px solid rgba(244, 199, 106, 0.72)"
            : "none"
          : selected
            ? "2px solid rgba(244, 199, 106, 0.72)"
            : "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: hasSprite ? 16 : "14px",
        background: hasSprite
          ? "transparent"
          : "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(15,23,42,0.72) 100%)",
        color: hasSprite ? "#111" : "var(--premium-text)",
        cursor: isEditMode ? "grab" : "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "12px",
        fontWeight: 700,
        lineHeight: 1.2,
        boxShadow: hasSprite
          ? "none"
          : "0 12px 28px rgba(2,6,23,0.32), inset 0 1px 0 rgba(255,255,255,0.08)",
        filter: hasSprite
          ? "drop-shadow(0 16px 28px rgba(2,6,23,0.34))"
          : undefined,
        overflow: "hidden",
      }}
    >
      {composition ? (
        <>
          <ComposedBuilding
            composition={composition}
            showPartBlueprint={isEditMode}
          />
          {!isEditMode ? (
            <span className="premium-building-level-badge">Lv {placement.level}</span>
          ) : null}
        </>
      ) : (
        <>
          <span>{placement.label}</span>
          <span style={{ fontSize: "10px", color: "var(--premium-text-soft)", fontWeight: 600 }}>
            Lv {placement.level}
          </span>
        </>
      )}
    </button>
  );
}
